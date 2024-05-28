import type { AudioToTextResponse } from '../../interfaces'

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData()
    formData.append('file', audioFile)
    if (prompt) {
      formData.append('prompt', prompt)
    }
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/audio-to-text`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = (await response.json()) as AudioToTextResponse

    return data
  } catch (error) {
    console.log('Error:', error)

    return null
  }
}
