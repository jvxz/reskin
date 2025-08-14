export const useCurrentSkin = createGlobalState(() => {
  const currentSkin = shallowRef<UserSkin | null>(null)
  return { currentSkin }
})
