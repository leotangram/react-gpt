self.onmessage = (event: MessageEvent<number>) => {
  console.log('Recibido del hilo principal:', event.data)

  // Realiza alguna operación
  const result = processData(event.data)

  // Envía el resultado de vuelta al hilo principal
  self.postMessage(result)
}

function processData(data: number): number {
  // Lógica de procesamiento
  return data * 2 // Ejemplo simple
}
