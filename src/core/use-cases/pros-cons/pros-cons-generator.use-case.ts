export async function* prosConsStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discussion-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt }),
        // TODO: abortSignal
        signal: abortSignal
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
      // console.log(text)
      yield text
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
