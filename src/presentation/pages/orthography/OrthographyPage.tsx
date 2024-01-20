import { useState } from 'react'
import {
  GPTMessage,
  GPTOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { orthographyUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
  info?: {
    userScore: number
    errors: string[]
    message: string
  }
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false }])

    const data = await orthographyUseCase(text)

    if (!data.ok) {
      setMessages(prev => [
        ...prev,
        { text: 'No se pudo realizar la corrección', isGPT: true }
      ])
    } else {
      setMessages(prev => [
        ...prev,
        {
          text: data.message,
          isGPT: true,
          info: {
            errors: data.errors,
            message: data.message,
            userScore: data.userScore
          }
        }
      ])
    }

    setIsLoading(false)

    // TODO: Add GPT message in true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />
          {messages.map(({ isGPT, text, info }, index) =>
            isGPT ? (
              <GPTOrthographyMessage key={Math.random() + index} {...info!} />
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
