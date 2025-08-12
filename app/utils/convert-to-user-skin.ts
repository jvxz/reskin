export function convertToUserSkin(skin: LocalSkin): UserSkin {
  return {
    ...skin,
    skinUrl: '',
    thumbnailUrl: '',
    userId: '',
  }
}
