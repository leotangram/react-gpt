import { FormEvent, useState } from 'react'

interface TextMessageBoxProps {
  disableCorrections?: boolean
  onSendMessage: (message: string) => void
  placeholder?: string
}

export const TextMessageBox = ({
  disableCorrections = false,
  onSendMessage,
  placeholder = ''
}: TextMessageBoxProps) => {
  const [message, setMessage] = useState('')

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (message.trim().length === 0) return

    onSendMessage(message)
    setMessage('')
  }

  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
      onSubmit={handleSendMessage}
    >
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            name="message"
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'off' : 'on'}
            autoCorrect={disableCorrections ? 'off' : 'on'}
            spellCheck={disableCorrections}
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
        </div>
      </div>
      <div className="ml-4">
        <button className="btn-primary">
          <span className="mr-2">Enviar</span>
          <i className="fa-regular fa-paper-plane" />
        </button>
      </div>
    </form>
  )
}
