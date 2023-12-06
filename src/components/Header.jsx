import React from 'react'

const Header = () => {
  return (
    <header>
      <div className="logo-image">
        <lottie-player
          src="https://lottie.host/cb188d05-9cd8-4a24-9261-9cb8c5cfce77/e9ChbAriHb.json"
          speed="1"
          loop
          autoplay
          direction="1"
          mode="normal"
        ></lottie-player>
      </div>
      <div>
        <h1 className="header-text">PugBot</h1>
        <p className="header-desc">Pawsome Chat Buddy</p>
      </div>
    </header>
  )
}

export default Header
