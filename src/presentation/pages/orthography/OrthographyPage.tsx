import {
  GPTMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'

export const OrthographyPage = () => {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GPTMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />
          <MyMessage text="HOli" />
          <TypingLoader className="fade-in" />
        </div>
      </div>
      <TextMessageBox
        onSendMessage={message => console.log(message)}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  )
}
