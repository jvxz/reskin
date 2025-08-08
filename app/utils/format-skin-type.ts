export function formatSkinType(skinType: 'SLIM' | 'CLASSIC') {
  return (
    skinType.charAt(0).toUpperCase() + skinType.slice(1).toLocaleLowerCase()
  )
}
