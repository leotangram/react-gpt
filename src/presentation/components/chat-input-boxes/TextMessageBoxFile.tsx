import { FormEvent, useRef, useState } from 'react'

interface TextMessageBoxFileProps {
  disableCorrections?: boolean
  onSendMessage: (message: string) => void
  placeholder?: string
  accept?: string
}

export const TextMessageBoxFile = ({
  disableCorrections = false,
  onSendMessage,
  placeholder = '',
  accept = 'image/*'
}: TextMessageBoxFileProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>()

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
      <div className="mr-3">
        <button
          type="button"
          className="flex items-center justify-center text-gray-400 hover:text-gray-600"
          onClick={() => inputFileRef.current?.click()}
        >
          <i className="fa-solid fa-paperclip text-xl" />
        </button>
        <input
          type="file"
          ref={inputFileRef}
          accept={accept}
          onChange={event => setSelectedFile(event.target.files?.item(0))}
          hidden
        />
      </div>
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
        <button className="btn-primary" disabled={!selectedFile}>
          {!selectedFile ? (
            <span className="mr-2">Enviar</span>
          ) : (
            <span className="mr-2">
              {selectedFile.name.substring(0, 10) + '...'}
            </span>
          )}

          <i className="fa-regular fa-paper-plane" />
        </button>
      </div>
    </form>
  )
}
