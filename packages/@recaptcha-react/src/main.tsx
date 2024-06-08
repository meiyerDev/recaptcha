import React from 'react'
import ReactDOM from 'react-dom/client'
import Recaptcha from './recaptcha'

type RecaptchaHandle = React.ElementRef<typeof Recaptcha>

const RecaptchaComponent = () => {
  const recaptchaRef = React.useRef<RecaptchaHandle | null>(null)

  const handleClick = () => {
    recaptchaRef.current?.execute().then((token) => {
      console.log(token)
    })
  }

  return (
    <>
      <button onClick={handleClick}>Execute</button>
      <Recaptcha ref={recaptchaRef} id='my-recaptcha' siteKey='6LdteZ8lAAAAAHqIZeUbEnTQsyPswWymS1_9m4sl' />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecaptchaComponent />,
)
