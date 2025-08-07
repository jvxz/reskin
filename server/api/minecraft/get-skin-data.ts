import type { Except, SetOptional } from 'type-fest'
import { Buffer } from 'node:buffer'
import { z } from 'zod'
import { getUsernameFromUuid } from '~~/server/utils/get-username-from-uuid'
import { validateNameMC } from '~~/server/utils/validate-namemc-url'

interface SkinResponse {
  timestamp: number
  profileId: string
  profileName: string
  textures: {
    SKIN: {
      url: string
      metadata?: {
        model: ('slim' | 'classic' | string & {})
      }
    }
    CAPE: {
      url: string
    }
  }
}

const BodySchema = z.object({
  imageFileBase64: z.base64().optional(),
  imageUrl: z.string().optional(),
  nameMcUrl: z.string().optional(),
  url: z.string().optional(),
  username: z.string().optional(),
  uuid: z.string().optional(),
})

export default defineEventHandler(async (event): Promise<LocalSkin> => {
  const body = await readValidatedBody(event, BodySchema.parse)

  if (body.username || body.uuid) {
    let uuid = body.uuid
    if (!uuid && body.username) {
      uuid = (await getUuidFromUsername(body.username)).id
    }

    let username = body.username
    if (!username && body.uuid) {
      username = (await getUsernameFromUuid(body.uuid)).name
    }

    const { base64, headBase64, skinType } = await getSkinDataFromUuid(uuid!)

    return createResponse({
      base64,
      headBase64,
      name: username!,
      originalName: username!,
      skinType,
      source: 'UUID',
      uuid: uuid!,
    })
  }

  if (body.imageFileBase64) {
    const headBase64 = await $fetch('/api/minecraft/get-head-base64', {
      body: {
        base64: body.imageFileBase64,
      },
      method: 'POST',
    })

    const skinType = await $fetch('/api/minecraft/get-skin-type', {
      body: {
        base64: body.imageFileBase64,
      },
      method: 'POST',
    })

    return createResponse({
      base64: body.imageFileBase64,
      headBase64,
      skinType,
      source: 'FILE_UPLOAD',
    })
  }

  if (body.imageUrl) {
    const { base64, headBase64 } = await processImageUrl(body.imageUrl)

    return createResponse({
      base64,
      headBase64,
      skinType: 'CLASSIC',
      source: 'URL',
    })
  }

  if (body.nameMcUrl) {
    const nameMcResult = validateNameMC(body.nameMcUrl)

    if (!nameMcResult) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid NameMC URL. Must be a valid skin or user URL',
      })
    }

    if (nameMcResult.type === 'skin') {
      const { base64, headBase64, skinType } = await processImageUrl(nameMcResult.url)

      return createResponse({
        base64,
        headBase64,
        skinType,
        source: 'NAME_MC',
      })
    }

    if (nameMcResult.type === 'user') {
      const { id: uuid } = await getUuidFromUsername(nameMcResult.username)

      const { base64, headBase64, skinType } = await getSkinDataFromUuid(uuid)

      return createResponse({
        base64,
        headBase64,
        name: nameMcResult.username,
        originalName: nameMcResult.username,
        skinType,
        source: 'NAME_MC',
        uuid,
      })
    }
  }

  if (body.url) {
    const { base64, headBase64, skinType } = await processImageUrl(body.url)

    return createResponse({
      base64,
      headBase64,
      skinType,
      source: 'URL',
    })
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'No input provided',
  })
})

async function processImageUrl(url: string, manualSkinType?: 'SLIM' | 'CLASSIC') {
  const image = await $fetch<ArrayBuffer>(url, { responseType: 'arrayBuffer' })
  const base64 = Buffer.from(image).toString('base64')

  const headBase64 = await $fetch('/api/minecraft/get-head-base64', {
    body: {
      base64,
    },
    method: 'POST',
  })

  const skinType: 'SLIM' | 'CLASSIC' = manualSkinType ?? await $fetch('/api/minecraft/get-skin-type', {
    body: {
      base64,
    },
    method: 'POST',
  })

  return {
    base64,
    headBase64,
    skinType,
  }
}

async function getSkinDataFromUuid(uuid: string) {
  const response = await $fetch<{
    id: string
    name: string
    properties: {
      name: string
      value: string
    }[]
  }>(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid!}`, {
    onResponseError: (error) => {
      if (error.response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found. Did you enter a valid UUID?',
        })
      }

      throw createError({
        statusCode: error.response.status,
        statusMessage: `Error fetching skin. Response from Mojang: ${error.response.statusText}`,
      })
    },
  })
  const decoded = JSON.parse(Buffer.from(response.properties[0].value, 'base64').toString()) as SkinResponse

  const rawType = decoded.textures.SKIN.metadata?.model ?? 'classic'

  const { base64, headBase64 } = await processImageUrl(decoded.textures.SKIN.url, rawType === 'slim' ? 'SLIM' : 'CLASSIC')

  return {
    base64,
    headBase64,
    skinType: rawType === 'slim' ? ('SLIM' as const) : ('CLASSIC' as const),
  }
}

function createResponse(skinData: SetOptional<Except<LocalSkin, 'id'>, 'originalName' | 'name' | 'uuid'>): LocalSkin {
  return {
    ...skinData,
    id: crypto.randomUUID(),
    name: skinData.name ?? 'Unnamed skin',
    originalName: skinData.originalName ?? null,
    uuid: skinData.uuid ?? null,
  }
}
