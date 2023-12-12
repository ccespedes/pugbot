import React, { useState, useRef, useMemo, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'

import happy from '../assets/pug-happy.png'
import sad from '../assets/pug-sad.png'
import cheeky from '../assets/pug-cheeky.png'
import sendBtn from '../assets/send-btn.svg'
import loader from '../assets/loader.svg'

import Header from './Header'
import MessageBubble from './MessageBubble'
import Error from './Error'

const Main = () => {
  const [formData, setFormData] = useState({
    text: '',
    mood: 'cheeky',
  })
  const [messageLog, setMessageLog] = useState([])
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dbLoaded, setDbloaded] = useState(false)
  const [conversationInDb, setConversationInDb] = useState('')
  const [greeting, setGreeting] = useState(
    `I'm your ${formData.mood} pugbot chat buddy, type your text and send!`
  )

  const messageContainerRef = useRef(null)

  useEffect(() => {
    async function setupDb() {
      const url = 'https://pugbot.netlify.app/.netlify/functions/firebase'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      const data = await response.json()
      const appSettings = {
        databaseUrl: data.databaseUrl,
        projectId: data.projectId,
      }

      const app = initializeApp(appSettings)
      const database = getDatabase(app)
      setConversationInDb(ref(database))

      get(ref(database)).then(async (snapshot) => {
        if (snapshot.exists()) {
          setMessageLog((prev) =>
            Object.values(snapshot.val()).map((message) => ({
              id: nanoid(),
              message: message.content,
              type: message.role,
              isDisplayed: true,
            }))
          )
        }
      })
      setDbloaded(true)
    }
    setupDb()
  }, [])

  const handleChange = (e) => {
    if (e.target.type === 'radio') {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
      setGreeting(
        `I'm your ${e.target.value} pugbot chat buddy, type your text and send!`
      )
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
    }
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
    fetchReply(formData.text, formData.mood)
    setFormData((prev) => ({ ...prev, text: '' }))
    scrollTop()
    setLoading(true)
  }

  const instructionObj = {
    role: 'system',
    content: `You are a ${formData.mood} pug canine with the ability to have a conversation with humans.`,
  }

  function fetchReply(text, mood) {
    messageDisplayed()
    push(conversationInDb, {
      role: 'user',
      content: `${text}`,
    })
    get(conversationInDb).then(async (snapshot) => {
      if (snapshot.exists()) {
        const conversationArr = Object.values(snapshot.val())
        conversationArr.unshift(instructionObj)
        try {
          const url = 'https://pugbot.netlify.app/.netlify/functions/fetchAI'
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify(conversationArr),
          })
          if (response.ok) {
            const data = await response.json()
            const translation = data.reply.choices[0].message.content
            push(conversationInDb, {
              role: 'system',
              content: translation,
            })
            setMessageLog((prev) => [
              ...prev,
              {
                id: nanoid(),
                message: translation,
                type: 'bot',
                isDisplayed: false,
              },
            ])
            setLoading(false)
          } else {
            console.error('Failed to fetch data:', response.statusText)
            setError(true)
            setErrorMsg(
              <Error dismissError={dismissError} errorMessage={`${error}`} />
            )
          }
        } catch (error) {
          setError(true)
          setErrorMsg(
            <Error dismissError={dismissError} errorMessage={`${error}`} />
          )
        }
      } else {
        setError(true)
        setErrorMsg(
          <Error dismissError={dismissError} errorMessage={`${error}`} />
        )
      }
    })
  }

  const dismissError = () => {
    setError(false)
  }

  const startOver = () => {
    remove(conversationInDb)
    setMessageLog([])
  }

  const scrollTop = () => {
    const messageContainer = messageContainerRef.current
    messageContainer.scrollTop = messageContainer.scrollHeight
  }

  const messageDisplayed = () => {
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

  if (dbLoaded) {
    return (
      <>
        <Header startOver={startOver} mood={formData.mood} />
        <main>
          <div id="error">{error && errorMsg}</div>
          <form onSubmit={handleSubmit} id="mood">
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

            <div className="mood-group mb">
              <label>
                <input
                  type="radio"
                  id="happy"
                  name="mood"
                  value="happy"
                  checked={formData.mood === 'happy'}
                  onChange={handleChange}
                />
                <img src={happy} alt="Happy Pug" />
              </label>

              <label>
                <input
                  type="radio"
                  id="sad"
                  name="mood"
                  value="sad"
                  checked={formData.mood === 'sad'}
                  onChange={handleChange}
                />
                <img src={sad} alt="Sad Pug" />
              </label>

              <label>
                <input
                  type="radio"
                  id="cheeky"
                  name="mood"
                  value="cheeky"
                  checked={formData.mood === 'cheeky'}
                  onChange={handleChange}
                />
                <img src={cheeky} alt="Mischievous Pug" />
              </label>
            </div>
          </form>

          <div className="message-container" ref={messageContainerRef}>
            <div id="setup">
              <div className="message message-bot">{greeting}</div>

              <div id="chat">{chatMessages}</div>

              <div id="loading">
                {loading && <img className="svg" src={loader} />}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  } else {
    return <img className="svg" src={loader} />
  }
}

export default Main
