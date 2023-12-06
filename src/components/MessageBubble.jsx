import React, { useEffect, useState } from 'react'

const MessageBubble = ({ message, type, messageLog, id, scrollTop }) => {
  const [textMessage, setTextMessage] = useState('')
  const [cursor, setCursor] = useState(true)
  console.log('messageBubble rendered')
  const usedId = messageLog.map((message) => message.id).pop()
  const isDisplayed = messageLog.every((msg) => msg.isDisplayed)
  //   console.log('message bubble isDisplayed: ', isDisplayed)

  useEffect(() => {
    let interval
    if (type === 'bot' && !isDisplayed && id === usedId) {
      let i = 0
      interval = setInterval(() => {
        setTextMessage((prev) => [...prev, message.charAt(i++)])
        if (message.length === i) {
          setCursor(false)
          clearInterval(interval)
        }
        //   i++
      }, 50)
    } else {
      setTextMessage(message)
      setCursor(false)
    }
    return () => clearInterval(interval)
  }, [])

  setTimeout(() => {
    scrollTop()
  }, 5)

  return (
    <div
      className={`message message-${type === 'user' ? 'user' : 'bot'} ${
        cursor ? 'blinking-cursor' : ''
      }`}
    >
      {textMessage}
    </div>
  )
}

export default MessageBubble
