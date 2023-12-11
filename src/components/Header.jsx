import React from 'react'

const Header = ({ startOver, mood }) => {
  return (
    <header>
      <div onClick={startOver} className="start-over">
        start over
      </div>
      <div className="thought-cloud-container">
        <div id="thought-cloud" className="thought-cloud">
          {`I'm feeling ${mood}...`}
        </div>
      </div>
      <div className="logo-image">
        <lottie-player
          src="https://lottie.host/cb188d05-9cd8-4a24-9261-9cb8c5cfce77/e9ChbAriHb.json"
          speed="1"
          // style="width: 300px; height: 300px"
          loop
          autoplay
          direction="1"
          mode="normal"
        ></lottie-player>
      </div>
      <div className="logo-container">
        <h1 className="header-text">PugBot</h1>
        <p className="header-desc">Pawsome Chat Buddy</p>
      </div>
    </header>
  )
}

export default Header
