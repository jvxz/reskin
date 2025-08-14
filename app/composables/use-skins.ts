import pLimit from 'p-limit'

const limit = pLimit(4)

// _ = private

export function useSkins() {
  const { $get } = useNuxtApp()
  const _skins = useNuxtData<UserSkin[]>('skins')
  const { clearLocalSkins, localSkins } = useLocalSkins()
  const { currentSkin } = useCurrentSkin()
  const currentPendingSkin = useCurrentlyPending()

  const { execute: _fetchSkins, refresh: _refreshSkinsRaw } = useFetch('/api/user/get-skins', {
    dedupe: 'defer',
    immediate: false,
    key: 'skins',
    lazy: true,
  })

  const _refreshSkins = useDebounceFn(_refreshSkinsRaw, 3000)

  async function getSkins(isAuthed: boolean) {
    if (!isAuthed) {
      return localSkins
    }

    await _fetchSkins()
    return _skins.data
  }

  const { isLoading: isAddingSkin, mutate: addSkin } = useMutation({
    mutation: async (opts: {
      isAuthed: boolean
      input: {
        username?: string
        uuid?: string
        url?: string
        nameMcUrl?: string
        imageUrl?: string
        imageFileBase64?: string
      }
    }) => {
      const skinData = await $get('/api/minecraft/get-skin-data', {
        body: opts.input,
        method: 'POST',
      })

      const pendingSkin = convertToUserSkin(skinData)
      currentSkin.value = pendingSkin

      if (!opts.isAuthed) {
        return localSkins.value.push(pendingSkin)
      }

      _addOptimisticSkin(pendingSkin)
      currentPendingSkin.value = pendingSkin.id

      const thumbnailBase64 = await generateThumbnail(skinData)

      await $get('/api/user/add-skin', {
        body: {
          ...skinData,
          thumbnailBase64,
        },
        method: 'POST',
        onResponse: () => {
          _refreshSkins()
          currentPendingSkin.value = null
        },
      })
    },
  })

  async function deleteSkin(opts: {
    isAuthed: boolean
    skin: UserSkin
  }) {
    if (!opts.isAuthed) {
      return localSkins.value = localSkins.value.filter(skin => skin.uuid !== opts.skin.uuid)
    }

    _skins.data.value = _skins.data.value?.filter(skin => skin.id !== opts.skin.id)

    await $get('/api/user/delete-skin', {
      body: {
        id: opts.skin.id,
      },
      method: 'POST',
      onResponse: () => _refreshSkins(),
    })
  }

  const { isLoading: isMigratingSkins, mutate: migrateLocalSkins } = useMutation({
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

      await $get('/api/user/migrate-skins', {
        body: userSkins,
        method: 'POST',
      })

      return userSkins
    },
    onSettled: () => _refreshSkins(),
    onSuccess: () => {
      clearLocalSkins()
      useNuxtApp().$toast.success('Your skins were successfully migrated to your account')
    },
  })

  function _addOptimisticSkin(skin: UserSkin) {
    const cachedSkins = _skins.data.value ?? []
    const newSkins = [...cachedSkins, skin]

    _skins.data.value = newSkins
  }

  return {
    addSkin,
    currentPendingSkin,
    deleteSkin,
    getSkins,
    isAddingSkin,
    isMigratingSkins,
    migrateLocalSkins,
  }
}
