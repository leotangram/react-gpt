export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
        // TODO: abortSignal
      }
    )
    if (!response.ok) throw new Error('No se pudo realizar la comparación')

    const reader = response.body?.getReader()

    if (!reader) {
      console.error('No se pudo obtener el reader')
      return null
    }

    const decoder = new TextDecoder()

    let text = ''

    while (true) {
      const { value, done } = await reader.read()

      if (done) break

      const decodedChunk = decoder.decode(value, { stream: true })

      text += decodedChunk
      console.log(text)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
