export const useCurrentSkin = createGlobalState(() => {
  const currentSkin = shallowRef<UserSkin | LocalSkin | null>(null)
  return { currentSkin }
})
