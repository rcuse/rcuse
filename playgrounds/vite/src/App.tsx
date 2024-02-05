import { useState } from 'react'

function App() {
  const [count] = useState(0)

  return (
    <>
      {count}
    </>
  )
}

export default App
