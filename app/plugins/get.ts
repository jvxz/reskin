import type { H3Error } from 'h3'

export default defineNuxtPlugin({
  setup() {
    const { $toast } = useNuxtApp()

    const get = $fetch.create({
      onResponse: async ({ response }) => {
        const errorData = response._data as H3Error & { error: boolean }

        if (errorData.error) {
          $toast.error(errorData.message ?? 'An unexpected error occurred')
        }
      },
    })

    return {
      provide: {
        get,
      },
    }
  },
})
