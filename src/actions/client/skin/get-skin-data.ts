import { z } from 'zod'
import { getSkinDataFromUser } from '@/actions/server/skin/get-skin-data-from-user'
import { getSkinHeadBase64 } from '@/actions/server/skin/get-skin-head-base64'
import { getSkinType } from '@/actions/server/skin/get-skin-type'
import { fetchBlobFromServer } from '@/actions/server/utils/fetch-blob-from-server'
import type { Skin } from '@/db/schema'
import { validateNameMC } from '@/lib/utils'

export async function getSkinData(
  input: File | string,
): Promise<Omit<Skin, 'userId' | 'skinUrl' | 'thumbnailUrl'>> {
  const now = new Date()

  const isFile = input instanceof File
  const isUrl = z
    .url({
      protocol: /^https?$/,
    })
    .safeParse(input).success
  const isNameMC = validateNameMC(input)

  if (isNameMC) {
    if (isNameMC.type === 'skin') {
      const blob = await fetchBlobFromServer(isNameMC.url)
      const base64 = await getSkinBase64FromFile(blob)
      const skinType = await getSkinType(base64)
      const headBase64 = await getSkinHeadBase64(base64)

      return {
        base64,
        createdAt: now,
        headBase64,
        id: crypto.randomUUID(),
        name: 'Unnamed skin',
        originalName: null,
        skinType,
        source: 'NAME_MC',
        uuid: null,
      }
    }

    const { skinBlob, skinType, name, uuid } = await getSkinDataFromUser(
      isNameMC.username,
    )

    const base64 = await getSkinBase64FromFile(skinBlob)
    const headBase64 = await getSkinHeadBase64(base64)

    return {
      base64,
      createdAt: now,
      headBase64,
      id: crypto.randomUUID(),
      name,
      originalName: name,
      skinType,
      source: 'USERNAME',
      uuid,
    }
  }

  if (isFile) {
    const base64 = await getSkinBase64FromFile(input)
    const skinType = await getSkinType(base64)
    const headBase64 = await getSkinHeadBase64(base64)

    return {
      base64,
      createdAt: now,
      headBase64,
      id: crypto.randomUUID(),
      name: 'Unnamed skin',
      originalName: null,
      skinType,
      source: 'FILE_UPLOAD',
      uuid: null,
    }
  }

  if (isUrl) {
    const blob = await fetchBlobFromServer(input)
    const base64 = await getSkinBase64FromFile(blob)
    const skinType = await getSkinType(base64)
    const headBase64 = await getSkinHeadBase64(base64)

    return {
      base64,
      createdAt: now,
      headBase64,
      id: crypto.randomUUID(),
      name: 'Unnamed skin',
      originalName: null,
      skinType,
      source: 'URL',
      uuid: null,
    }
  }

  const { skinBlob, skinType, name, uuid } = await getSkinDataFromUser(input)

  const base64 = await getSkinBase64FromFile(skinBlob)
  const headBase64 = await getSkinHeadBase64(base64)

  const isUuid = z.uuid().safeParse(uuid).success

  return {
    base64,
    createdAt: now,
    headBase64,
    id: crypto.randomUUID(),
    name,
    originalName: name,
    skinType,
    source: isUuid ? 'UUID' : 'USERNAME',
    uuid,
  }
}

function getSkinBase64FromFile(input: File | Blob) {
  const reader = new FileReader()

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64.split(',')[1])
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(input)
  })
}
