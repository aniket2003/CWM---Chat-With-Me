import React from 'react'

function FriendDetailModal({ isOpen, onClose, user }) {
  console.log(user);
  return (
    <div className="UserCardmodal-overlay">
    <div className="UserCardmodal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close-btn" onClick={onClose}>&times;</span>
      <div className="FriendDetailModalParent">
      <img className='FriendDetailModalprofile-pic' src={user.ProfilePic}/>
       <div className="FriendDetailModalChild">
      <h2>{user.username}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
       </div>
      </div>
    </div>
  </div>
  )
}

export default FriendDetailModal