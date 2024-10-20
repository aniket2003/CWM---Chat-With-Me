import {React, useState, useEffect} from 'react';
import "../css/Chat.css";
import { useSelector } from 'react-redux';
import { selectCurrentSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import FriendDetailModal from './FriendDetailModal/FriendDetailModal';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import UnFriendModal from './UnFriendModal/UnFriendModal';
import { selectCurrentUser } from '../redux/auth/authSlice';
import { useSocket } from '../context/SocketContext';
import CallerModal from './CallerModal/CallerModal';
import Peer from "peerjs";
function ChatHeader() {

  const selectedUser = useSelector(selectCurrentSelectedUser);
  const User = useSelector(selectCurrentUser);
  const [FriendDetailToggled, setFriendDetailToggled] = useState(false);
  const [isUnFriendModalOpen , setUnFriendModalOpen] = useState(false);
  const [isCallerModalOpen, setIsCallerModalOpen] = useState(false); 
  const dispatch = useDispatch();
  const [peerId, setPeerId] = useState(null);
  const [peer, setPeer] = useState(null);
  const {socket, receivercanceledcall, callercanceleddata} = useSocket();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Get Ready");
  const getDetails = () => {
     setFriendDetailToggled(!FriendDetailToggled);
  }

  const CloseCallerModal = ()=>{
    setIsCallerModalOpen(!isCallerModalOpen);
  }
  const goBack = ()=>{
    dispatch(setSelectedUser(null));
  }


  useEffect(()=>{

    if(receivercanceledcall){
      setIsCallerModalOpen(false);
      setNotificationMessage(`${callercanceleddata.username} Ended the calls`);
      if (Notification.permission === "granted") {
        new Notification(notificationMessage); // Use the new operator
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(notificationMessage); // Use the new operator
          }
        });
      }
      if(peer){
        peer.destroy();
    }
    }

  },[receivercanceledcall, callercanceleddata]);

  const InitiateCall = ()=>{

    const peer = new Peer();


    peer.on("open", (id)=>{
      setPeerId(id);
      setPeer(peer);
      console.log("My PeerId: ", id);
      socket.current.emit("call-user",{
        from: User._id,
        username: User.username,
        email: User.email,
        ProfilePic: User.ProfilePic,
        to: selectedUser._id,
        peerId: id, 
      });
    })

    setIsCallerModalOpen(true);


  }

  const UnFriend = ()=>{
    setUnFriendModalOpen(!isUnFriendModalOpen);
  }

  return (

    <div className="ChatHeader">
            {/* {showNotification && (
        <Notification notificationMessage={notificationMessage} />
      )} */}
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
        <button onClick={InitiateCall}>call</button>
        <button className="UnFriendButton" onClick={UnFriend}>UnFriend</button>
      </div>
      {isCallerModalOpen && <CallerModal myPeer = {peer} onClose={CloseCallerModal}/>}
    {FriendDetailToggled && <FriendDetailModal isOpen={FriendDetailToggled} onClose={getDetails} user={selectedUser}/>}
    {isUnFriendModalOpen && <UnFriendModal isOpen={isUnFriendModalOpen} onClose={UnFriend} user={selectedUser}/>}
    </div>
  )
}

export default ChatHeader