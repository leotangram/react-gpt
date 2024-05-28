interface Image {
  url: string
  alt: string
}

type GenerateImage = Image | null

export const ImageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GenerateImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          originalImage,
          maskImage
        })
      }
    )

    const { url, revised_prompt: alt } = await response.json()

    return { url, alt }
  } catch (error) {
    console.log(error)
    return null
  }
}
