import { useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { prosConsStreamUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false }])

    await prosConsStreamUseCase(text)

    setIsLoading(false)

    // TODO: Add GPT message in true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />
          {messages.map(({ isGPT, text }, index) =>
            isGPT ? (
              <GPTMessage
                key={Math.random() + index}
                text="Esto es de OpenAI"
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
