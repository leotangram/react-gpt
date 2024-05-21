import { useState } from 'react'
import {
  GPTMessage,
  GPTMessageSelectableImage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import {
  ImageGenerationUseCase,
  imageVariationUseCase
} from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
  info?: {
    imageUrl: string
    alt: string
  }
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      isGPT: true,
      text: 'Imagen base',
      info: {
        imageUrl:
          'http://localhost:3000/gpt/image-generation/1716313477521.png',
        alt: 'base image'
      }
    }
  ])
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined
  })

  const handleVariation = async () => {
    setIsLoading(true)
    const response = await imageVariationUseCase(originalImageAndMask.original)
    setIsLoading(false)

    if (!response) return

    setMessages(prev => [
      ...prev,
      {
        text: 'Variación generada',
        isGPT: true,
        info: {
          imageUrl: response.url,
          alt: response.alt
        }
      }
    ])
  }

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages(prev => [
      ...prev,
      {
        text,
        isGPT: false
      }
    ])

    const { original, mask } = originalImageAndMask

    const imageInfo = await ImageGenerationUseCase(text, original, mask)

    setIsLoading(false)

    if (!imageInfo) {
      return setMessages(prev => [
        ...prev,
        { text: 'No se pudo generar la imagen', isGPT: true }
      ])
    }

    setMessages(prev => [
      ...prev,
      {
        text,
        isGPT: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt
        }
      }
    ])
  }

  return (
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt="original image"
          />
          <button className="btn-primary mt-2" onClick={handleVariation}>
            Generar variación
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GPTMessage text="Qué imagen deseas generar hoy?" />
            {messages.map(({ isGPT, text, info }, index) =>
              isGPT ? (
                <GPTMessageSelectableImage
                  key={Math.random() + index}
                  imageUrl={info!.imageUrl}
                  alt={info!.alt}
                  onSelectedImage={maskImageUrl =>
                    setOriginalImageAndMask({
                      original: info!.imageUrl,
                      mask: maskImageUrl
                    })
                  }
                />
              ) : (
                <MyMessage key={Math.random() + index} text={text} />
              )
            )}
            {isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )}
          </div>
        </div>
        <TextMessageBox
          onSendMessage={handlePost}
          placeholder="Escribe aquí lo que deseas"
          disableCorrections
        />
      </div>
    </>
  )
}
