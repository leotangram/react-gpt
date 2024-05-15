import { useState } from 'react'
import {
  GPTMessage,
  MyMessage,
  TextMessageBoxFile,
  TypingLoader
} from '../../components'
import { audioToTextUseCase } from '../../../core/use-cases'

type Message = {
  text: string
  isGPT: boolean
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false }])

    const response = await audioToTextUseCase(audioFile, text)

    setIsLoading(false)

    if (!response) return

    const gptMessage = `
      ## Transcripción de audio:
      __Duración: __ ${Math.round(response.duration)} segundos

      ### El texto es:
      ${response.text}
    `
    setMessages(prev => [...prev, { text: gptMessage, isGPT: true }])

    for (const segment of response.segments) {
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
      ${segment.text}
      `
      setMessages(prev => [...prev, { text: segmentMessage, isGPT: true }])
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Hola, qué audio quieres generar hoy?" />
          {messages.map(({ isGPT, text }, index) =>
            isGPT ? (
              <GPTMessage key={Math.random() + index} text={text} />
            ) : (
              <MyMessage
                key={Math.random() + index}
                text={text ?? 'Transcribe el audio'}
              />
            )
          )}
          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
        accept="audio/*"
      />
    </div>
  )
}
