import z from 'zod'

type NameMCResult
  = | {
    type: 'skin'
    url: string
  }
  | {
    type: 'user'
    username: string
  }
  | false

export function validateNameMC(link: string): NameMCResult {
  const isNameMC = z
    .url({
      hostname: /^namemc\.com$/,
    })
    .safeParse(link)

  if (!isNameMC.success) {
    return false
  }

  const url = new URL(isNameMC.data)

  if (url.pathname === '/') {
    return false
  }

  if (url.pathname.startsWith('/skin/')) {
    const skinId = url.pathname.split('/').pop()
    const skinUrl = `https://s.namemc.com/i/${skinId}.png`

    return {
      type: 'skin' as const,
      url: skinUrl,
    }
  }

  if (url.pathname.startsWith('/profile/')) {
    const username = url.pathname.split('/')[2].split('.')[0]

    return {
      type: 'user' as const,
      username,
    }
  }

  return false
}
