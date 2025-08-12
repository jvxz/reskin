const LOCAL_SKINS_KEY = 'user-skins'

export function useLocalSkins() {
  const localSkins = useLocalStorage<UserSkin[]>(LOCAL_SKINS_KEY, [])

  function clearLocalSkins() {
    localSkins.value = []
  }

  return {
    clearLocalSkins,
    localSkins,
  }
}
