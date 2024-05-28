import { useEffect, useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import {
  createThreadUseCase,
  postQuestionUseCase
} from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [threadId, setThreadId] = useState<string>()

  useEffect(() => {
    const threadId = localStorage.getItem('threadId')

    if (threadId) {
      setThreadId(threadId)
    } else {
      createThreadUseCase().then(id => {
        setThreadId(id)
        localStorage.setItem('threadId', id)
      })
    }
  }, [])

  useEffect(() => {
    if (threadId) {
      setMessages(prev => [
        ...prev,
        {
          text: `Número de thread: ${threadId}`,
          isGPT: true
        }
      ])
    }
  }, [threadId])

  const handlePost = async (text: string) => {
    if (!threadId) return

    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false }])

    const replies = await postQuestionUseCase(threadId, text)

    setIsLoading(false)

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages(prev => [
          ...prev,
          {
            text: message,
            isGPT: reply.role === 'assistant',
            info: reply
          }
        ])
      }
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Buen día, soy Sam. En qué puedo ayudarte?" />
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
