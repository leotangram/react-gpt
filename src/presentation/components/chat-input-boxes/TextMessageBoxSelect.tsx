import { FormEvent, useState } from 'react'

interface TextMessageBoxSelectProps {
  disableCorrections?: boolean
  onSendMessage: (message: string, selectedOption: string) => void
  placeholder?: string
  options: Option[]
}

type Option = {
  id: string
  text: string
}

export const TextMessageBoxSelect = ({
  disableCorrections = false,
  onSendMessage,
  placeholder = '',
  options
}: TextMessageBoxSelectProps) => {
  const [message, setMessage] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (message.trim().length === 0) return

    onSendMessage(message, selectedOption)
    setMessage('')
  }

  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
      onSubmit={handleSendMessage}
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            type="text"
            autoFocus
            name="message"
            className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'off' : 'on'}
            autoCorrect={disableCorrections ? 'off' : 'on'}
            spellCheck={disableCorrections}
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <select
            name="select"
            className="w-2/5 ml-5 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            value={selectedOption}
            onChange={event => setSelectedOption(event.target.value)}
          >
            <option value="">Seleccione</option>
            {options.map(({ id, text }) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>
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
