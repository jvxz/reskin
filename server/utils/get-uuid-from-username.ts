export async function getUuidFromUsername(username: string) {
  const response = await $fetch<{
    name: string
    id: string
  }>(`https://api.mojang.com/users/profiles/minecraft/${username}`, {
    onResponseError: (error) => {
      if (error.response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found. Did you enter a valid username?',
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
