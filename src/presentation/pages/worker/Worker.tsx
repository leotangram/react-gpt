import { useEffect, useState } from 'react'
import MyWorker from '../../../workers/myWorker?worker'

export const WorkerPage = () => {
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    const worker = new MyWorker() as Worker

    worker.postMessage(10)

    worker.onmessage = (event: MessageEvent<number>) => {
      setResult(event.data)
    }

    return () => {
      worker.terminate()
    }
  }, [])

  return (
    <div>
      <h1>Worker</h1>
      <p>Result: {result}</p>
    </div>
  )
}
