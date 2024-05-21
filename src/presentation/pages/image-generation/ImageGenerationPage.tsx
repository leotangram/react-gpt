import { useState } from 'react'
import {
  GPTMessage,
  GPTMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { ImageGenerationUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
  info?: {
    imageUrl: string
    alt: string
  }
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages(prev => [
      ...prev,
      {
        text,
        isGPT: false,
        info: {
          imageUrl: '',
          alt: ''
        }
      }
    ])

    const imageInfo = await ImageGenerationUseCase(text)

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
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Qué imagen deseas generar hoy?" />
          {messages.map(({ isGPT, text, info }, index) =>
            isGPT ? (
              <GPTMessageImage
                key={Math.random() + index}
                imageUrl={info!.imageUrl}
                alt={info!.alt}
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
  )
}
