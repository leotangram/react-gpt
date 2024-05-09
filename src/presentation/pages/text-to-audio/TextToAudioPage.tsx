import { useState } from 'react'
import {
  GPTMessage,
  GPTMessageAudio,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader
} from '../../components'
import { textToAudioUseCase } from '../../../core/use-cases'

const disclaimer = `## Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' }
]

interface AudioMessage {
  audio: string
  isGPT: boolean
  text: string
  type: 'audio'
}

interface TextMessage {
  audio?: string
  text: string
  isGPT: boolean
  type: 'text'
}

type Message = AudioMessage | TextMessage

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { text, isGPT: false, type: 'text' }])

    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    )

    setIsLoading(false)

    if (!ok) return

    setMessages(prev => [
      ...prev,
      {
        audio: audioUrl!,
        isGPT: true,
        text: `${selectedVoice} - ${message}`,
        type: 'audio'
      }
    ])
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text={disclaimer} />
          {messages.map(({ text, type, isGPT, audio }, index) =>
            isGPT ? (
              type === 'audio' ? (
                <GPTMessageAudio
                  key={Math.random() + index}
                  text={text}
                  audio={audio as string}
                />
              ) : (
                <GPTMessage key={Math.random() + index} text={text} />
              )
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
        options={voices}
      />
    </div>
  )
}
