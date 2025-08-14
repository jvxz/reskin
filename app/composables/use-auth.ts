export async function useAuth() {
  const { data: session } = await authClient.useSession(useFetch)

  const isAuthed = computed(() => !!session.value?.user)

  return {
    isAuthed,
    session,
  }
}
