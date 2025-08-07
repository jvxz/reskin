export async function getUsernameFromUuid(uuid: string) {
  const response = await $fetch<{
    name: string
    id: string
  }>(`https://api.minecraftservices.com/minecraft/profile/lookup/${uuid}`, {
    onResponseError: (error) => {
      if (error.response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found. Did you enter a valid UUID?',
        })
      }

      throw createError({
        statusCode: error.response.status,
        statusMessage: error.response.statusText,
      })
    },
  })

  return response
}
