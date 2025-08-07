export function getFileFromB64(
  b64: string,
  name = 'image',
  type?: string,
): File {
  const comma = b64.indexOf(',')
  const isDataUri = comma > -1 && comma < 128
  const raw = isDataUri ? b64.slice(comma + 1) : b64

  const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0))

  if (!type && isDataUri) {
    type = b64.slice(b64.indexOf(':') + 1, b64.indexOf(';'))
  }

  return new File([bytes], name, { type: type || 'application/octet-stream' })
}
