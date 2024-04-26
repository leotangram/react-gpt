import { useRef, useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController())
  const isRunning = useRef(false)

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort()
      abortController.current = new AbortController()
    }

    setIsLoading(true)
    isRunning.current = true
    setMessages(prev => [...prev, { text, isGPT: false }])

    const stream = prosConsStreamGeneratorUseCase(
      text,
      abortController.current.signal
    )
    setIsLoading(false)

    setMessages(prevMessages => [...prevMessages, { text: '', isGPT: true }])

    for await (const text of stream) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages]

        newMessages[newMessages.length - 1].text = text
        return newMessages
      })
    }

    isRunning.current = false
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Qué deseas comparar hoy?" />
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
