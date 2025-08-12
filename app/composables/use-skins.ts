import type { H3Error } from 'h3'

const SKINS_QUERY_KEY = 'user-skins'
const LOCAL_SKINS_KEY = 'user-skins'
const ADD_SKIN_KEY = 'add-skin'

export function useSkins() {
  const qc = useQueryCache()
  const localSkins = useLocalStorage<UserSkin[]>(LOCAL_SKINS_KEY, [])

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
    skins,
  }
}

function onError(error: H3Error) {
  useNuxtApp().$toast.error(error.statusMessage ?? 'An unknown error occurred')
}
