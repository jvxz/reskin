export function getSkinBase64FromFile(input: File | Blob) {
  const reader = new FileReader()

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64.split(',')[1]!)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(input)
  })
}
