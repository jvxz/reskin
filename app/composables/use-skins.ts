import type { H3Error } from 'h3'
import pLimit from 'p-limit'

const limit = pLimit(4)

const SKINS_QUERY_KEY = 'user-skins'
const ADD_SKIN_KEY = 'add-skin'
const MIGRATE_SKINS_KEY = 'migrate-skins'

export function useSkins() {
  const qc = useQueryCache()
  const { clearLocalSkins, localSkins } = useLocalSkins()

  const ready = computed(() => !authClient.useSession().value.isPending)
  const isAuthenticated = computed(() => !!authClient.useSession().value.data?.user)

  const { data: skins, isLoading: isLoadingSkins, refetch: refetchSkins } = useQuery({
    enabled: ready,
    key: [SKINS_QUERY_KEY],
    query: async (): Promise<UserSkin[]> => {
      if (!isAuthenticated.value) {
        return localSkins.value
      }

      return $fetch('/api/user/get-skins')
    },
  })

  const { isLoading: isAddingSkin, mutate: addSkin } = useMutation({
    key: [ADD_SKIN_KEY],
    mutation: async (props: {
      username?: string
      uuid?: string
      url?: string
      nameMcUrl?: string
      imageUrl?: string
      imageFileBase64?: string
    }) => {
      triggerPendingSkin()

      const skinData = await $fetch('/api/minecraft/get-skin-data', {
        body: props,
        method: 'POST',
      })

      if (!isAuthenticated.value) {
        return localSkins.value.push(convertToUserSkin(skinData))
      }

      addOptimisticSkin(convertToUserSkin(skinData))

      const thumbnailBase64 = await generateThumbnail(skinData)

      const res = await $fetch('/api/user/add-skin', {
        body: {
          ...skinData,
          thumbnailBase64,
        },
        method: 'POST',
      })

      return res
    },
    onError,
    onSettled: () => {
      removePendingSkin()
      refetchSkins()
    },
  })

  const { isLoading: isMigratingSkins, mutate: migrateLocalSkins } = useMutation({
    key: [MIGRATE_SKINS_KEY],
    mutation: async () => {
      const procedures = localSkins.value.map(async (skin): Promise<LocalSkin & { thumbnailBase64: string }> => limit(async () => {
        const thumbnailBase64 = await generateThumbnail(skin, {
          returnType: 'base64',
        })

        return {
          ...skin,
          thumbnailBase64,
        }
      }))

      const userSkins = await Promise.all(procedures)

      await $fetch('/api/user/migrate-skins', {
        body: userSkins,
        method: 'POST',
      })

      return userSkins
    },
    onError,
    onSettled: () => refetchSkins(),
    onSuccess: () => {
      clearLocalSkins()
      useNuxtApp().$toast.success('Your skins were successfully migrated to your account')
    },
  })

  function getCachedSkins() {
    return qc.getQueryData<UserSkin[]>([SKINS_QUERY_KEY])
  }

  function addOptimisticSkin(skin: UserSkin) {
    const cachedSkins = getCachedSkins()
    qc.setQueryData([SKINS_QUERY_KEY], [...(cachedSkins ?? []), skin])
  }

  function triggerPendingSkin() {
    if (!isAuthenticated.value) {
      return localSkins.value.push({
        base64: '',
        headBase64: '',
        id: 'pending',
        name: 'Pending',
        skinType: 'CLASSIC',
        skinUrl: '',
        source: 'FILE_UPLOAD',
        thumbnailUrl: '',
        userId: '',
      })
    }

    return addOptimisticSkin({
      base64: '',
      headBase64: '',
      id: crypto.randomUUID(),
      name: 'Pending',
      skinType: 'CLASSIC',
      skinUrl: '',
      source: 'FILE_UPLOAD',
      thumbnailUrl: '',
      userId: '',
    })
  }

  function removePendingSkin() {
    if (!isAuthenticated.value) {
      return localSkins.value = localSkins.value.filter(skin => skin.id !== 'pending')
    }

    const cachedSkins = getCachedSkins()
    qc.setQueryData([SKINS_QUERY_KEY], cachedSkins?.filter(skin => skin.id !== 'pending'))
  }

  return {
    addSkin,
    isAddingSkin,
    isLoadingSkins,
    isMigratingSkins,
    migrateLocalSkins,
    skins,
  }
}

function onError(error: H3Error) {
  useNuxtApp().$toast.error(error.statusMessage ?? 'An unknown error occurred')
}
