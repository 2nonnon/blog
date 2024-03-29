const copyText = (text: string) =>
  new Promise<void>((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject(new Error('Failed'))
        })
    }
  })

export default copyText
