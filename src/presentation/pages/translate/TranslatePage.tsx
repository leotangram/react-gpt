import { useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader
} from '../../components'
import { translateTextUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

const languages = [
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'inglés', text: 'Inglés' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' }
]

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true)
    const newMessage = `Traduce "${text}" al idioma ${selectedOption}`

    setMessages(prev => [...prev, { text: newMessage, isGPT: false }])

    const { message, ok } = await translateTextUseCase(text, selectedOption)

    setIsLoading(false)

    if (!ok) {
      return alert(message)
    }

    setMessages(prev => [...prev, { text: message, isGPT: true }])

    // TODO: Add GPT message in true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Qué quieres que traduzca hoy?" />
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
      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        options={languages}
      />
    </div>
  )
}
