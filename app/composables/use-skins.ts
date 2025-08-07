const SKINS_QUERY_KEY = 'user-skins'
const LOCAL_SKINS_KEY = 'user-skins'
const ADD_SKIN_KEY = 'add-skin'

export function useSkins() {
  const qc = useQueryCache()
  const isAuthenticated = computed(() => !!authClient.useSession().value.data?.user)

  const localSkins = useLocalStorage<LocalSkin[]>(LOCAL_SKINS_KEY, [])

  const { data: skins, isLoading: isLoadingSkins, refetch: refetchSkins } = useQuery({
    key: [SKINS_QUERY_KEY],
    query: async () => {
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
      imageFile?: File
    }) => {
      const skinData = await $fetch('/api/minecraft/get-skin-data', {
        body: props,
        method: 'POST',
      })

      if (!isAuthenticated.value) {
        return localSkins.value.push(skinData)
      }

      const cachedSkins = qc.getQueryData<UserSkin[]>([SKINS_QUERY_KEY])
      qc.setQueryData([SKINS_QUERY_KEY], [...(cachedSkins ?? []), skinData])

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
    onSettled: () => refetchSkins(),
  })

  return {
    addSkin,
    isAddingSkin,
    isLoadingSkins,
    skins,
  }
}

function onError(error: Error) {
  useNuxtApp().$toast.error(error.message)
}
