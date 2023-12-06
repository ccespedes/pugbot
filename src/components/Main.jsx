import React, { useState, useRef, useMemo } from 'react'
import { nanoid } from 'nanoid'
import OpenAI from 'openai'
import happy from '../assets/pug-happy.png'
import sad from '../assets/pug-sad.png'
import cheeky from '../assets/pug-cheeky.png'
import sendBtn from '../assets/send-btn.svg'
import loader from '../assets/loader.svg'
import MessageBubble from './MessageBubble'
import Error from './Error'

// import { process } from '../../env'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// })

const Main = () => {
  const [formData, setFormData] = useState({
    text: '',
    language: 'cheeky',
  })
  const [messageLog, setMessageLog] = useState([])
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const messageContainerRef = useRef(null)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessageLog((prev) => [
      ...prev,
      {
        id: nanoid(),
        message: formData.text,
        type: 'user',
        isDisplayed: false,
      },
    ])
    fetchReply(formData.text, formData.language)
    setFormData((prev) => ({ ...prev, text: '' }))
    scrollTop()
    setLoading(true)
  }

  const messages = [
    {
      role: 'system',
      content:
        'You are a pug canine with the ability to have a conversation with humans. You will be told which mood you are currently in so that your responses will reflect the given mood.',
    },
  ]

  console.log(messageLog)

  async function fetchReply(text, language) {
    messageDisplayed()
    messages.push({
      role: 'user',
      content: `You are feeling: ${language} while responding to the following: ${text}`,
    })
    try {
      const url = 'https://pugbot.netlify.app/.netlify/functions/fetchAI'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(messages),
      })
      const data = await response.json()
      console.log(data)
      // const response = await openai.chat.completions.create({
      //   model: 'gpt-3.5-turbo',
      //   messages: messages,
      // })
      // const translation = response.choices[0].message.content
      // messages.push({
      //   role: 'system',
      //   content: translation,
      // })

      // setMessageLog((prev) => [
      //   ...prev,
      //   { id: nanoid(), message: translation, type: 'bot', isDisplayed: false },
      // ])
      // setLoading(false)
    } catch (error) {
      console.log(error)
      setError(true)
      setErrorMsg(
        <Error dismissError={dismissError} errorMessage={`${error}`} />
      )
    }
  }

  const dismissError = () => {
    setError(false)
  }

  const scrollTop = () => {
    const messageContainer = messageContainerRef.current
    messageContainer.scrollTop = messageContainer.scrollHeight
  }

  const messageDisplayed = () => {
    console.log('messageDisplay')
    setMessageLog((prev) =>
      prev.map((message) => ({ ...message, isDisplayed: true }))
    )
    scrollTop()
  }

  const chatMessages = useMemo(() => {
    return messageLog.map((msg) => (
      <MessageBubble
        key={nanoid()}
        message={msg.message}
        type={msg.type}
        messageLog={messageLog}
        id={msg.id}
        scrollTop={scrollTop}
        messageDisplayed={() => messageDisplayed(msg.id)}
      />
    ))
  }, [messageLog])

  return (
    <main>
      <div id="error">{error && errorMsg}</div>
      <form onSubmit={handleSubmit} id="language">
        <div className="input-container mb">
          <input
            id="translate-text"
            type="text"
            autoFocus="autofocus"
            autoComplete="off"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          ></input>
          <button>
            <img className="svg" src={sendBtn} />
          </button>
        </div>

        <div className="language-group mb">
          <label>
            <input
              type="radio"
              id="happy"
              name="language"
              value="happy"
              checked={formData.language === 'happy'}
              onChange={handleChange}
            />
            <img src={happy} alt="Happy Pug" />
          </label>

          <label>
            <input
              type="radio"
              id="sad"
              name="language"
              value="sad"
              checked={formData.language === 'sad'}
              onChange={handleChange}
            />
            <img src={sad} alt="Sad Pug" />
          </label>

          <label>
            <input
              type="radio"
              id="cheeky"
              name="language"
              value="cheeky"
              checked={formData.language === 'cheeky'}
              onChange={handleChange}
            />
            <img src={cheeky} alt="Cheeky Pug" />
          </label>
        </div>
      </form>

      <div className="message-container" ref={messageContainerRef}>
        <div id="setup">
          <div className="message message-bot">
            Select my mood, type your text and send!
          </div>

          <div id="chat">{chatMessages}</div>

          <div id="loading">
            {loading && <img className="svg" src={loader} />}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Main
