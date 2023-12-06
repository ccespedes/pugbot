import React from "react"

const Error = ({ errorMessage, dismissError }) => {
  console.log("from Error component", errorMessage)
  return (
    <>
      <div className="error message">
        <p>{errorMessage.slice(0, 38)}</p>
        <div onClick={dismissError} className="close-btn">
          Dismiss
        </div>
      </div>
      <div className="modal-cover"></div>
    </>
  )
}

export default Error
