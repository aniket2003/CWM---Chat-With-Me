import React from 'react'
import "../css/Notification.css";

function Notification({notificationMessage}) {
  return (
    <div className="Notification">
    <p>{notificationMessage}</p>
  </div>
  )
}

export default Notification