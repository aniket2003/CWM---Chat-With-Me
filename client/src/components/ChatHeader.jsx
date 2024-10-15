import {React, useState} from 'react';
import "../css/Chat.css";
import { useSelector } from 'react-redux';
import { selectCurrentSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import FriendDetailModal from './FriendDetailModal/FriendDetailModal';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import UnFriendModal from './UnFriendModal/UnFriendModal';
function ChatHeader() {

  const selectedUser = useSelector(selectCurrentSelectedUser);
  const [FriendDetailToggled, setFriendDetailToggled] = useState(false);
  const [isUnFriendModalOpen , setUnFriendModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getDetails = () => {
     setFriendDetailToggled(!FriendDetailToggled);
  }

  const goBack = ()=>{
    dispatch(setSelectedUser(null))
  }

  const UnFriend = ()=>{
    setUnFriendModalOpen(!isUnFriendModalOpen);
  }

  return (

    <div className="ChatHeader">
      <div className="ChatHeaderLeft">
      <label htmlFor="goBackButton" className="goBackLabel">
          <img
            className="goBackIcon"
            src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728713795/CWM/Icons/ndx9dawpkmvqnrgxojz3.png"
            alt="paperclip icon"
          />
        </label>
        <button id="goBackButton" onClick={goBack} style={{'display': 'none'}}></button>
        <img className='profile-pic ChatHeaderProfilePic' src={selectedUser.ProfilePic} onClick={getDetails}/>
        <p>{selectedUser.username}</p>
      </div>
      <div className="ChatHeaderRight">
        <button>call</button>
        <button className="UnFriendButton" onClick={UnFriend}>UnFriend</button>
      </div>
    {FriendDetailToggled && <FriendDetailModal isOpen={FriendDetailToggled} onClose={getDetails} user={selectedUser}/>}
    {isUnFriendModalOpen && <UnFriendModal isOpen={isUnFriendModalOpen} onClose={UnFriend} user={selectedUser}/>}
    </div>
  )
}

export default ChatHeader