import { useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { prosConsUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false }])

    const { ok, content } = await prosConsUseCase(text)

    setIsLoading(false)

    if (!ok) return

    setMessages(prev => [...prev, { text: content, isGPT: true }])
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Puedes escribir lo que sea que quieres que compare y te daré mi punto de vista" />
          {messages.map(({ isGPT, text }, index) =>
            isGPT ? (
              <GPTMessage key={Math.random() + index} text={text} />
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
