type ImageType = 'image/png' | 'image/jpeg' | 'image/webp'
export const imageCompress = async (source: File, quality = 0.25) => {
  if (source.type !== 'image/png' && source.type !== 'image/jpeg' && source.type !== 'image/webp')
    throw new Error('TypeError: file type should be \'image/png\' | \'image/jpeg\' | \'image/webp\'.')

  if (quality < 0.1 || quality > 1)
    throw new Error('RangeError: quality should be [0.1, 1] and has two decimal places at most.')

  const src = URL.createObjectURL(source)
  const type = source.type as ImageType
  const name = source.name
  const img = new Image()
  img.src = src
  await new Promise((resolve) => {
    img.onload = resolve
  })
  const canvas = document.createElement('canvas')
  let width = img.naturalWidth
  let height = img.naturalHeight
  if (type === 'image/png') {
    const multi = Math.sqrt(1 / quality)
    width = Math.round(width / multi)
    height = Math.round(height / multi)
  }
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context?.drawImage(img, 0, 0, width, height)
  const result = await new Promise<File>((resolve) => {
    canvas.toBlob(
      (blob) => {
        const file = new File([blob!], name, { type })
        resolve(file)
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(file);
        // link.download = file.name;
        // link.click();
        // URL.revokeObjectURL(link.href);
      },
      type,
      quality,
    )
  })
  return result
}
