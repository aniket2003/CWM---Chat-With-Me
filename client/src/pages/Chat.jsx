import React, { useState ,useEffect } from 'react';
import "../css/Chat.css";
import Navbar from '../components/Navbar';
import ChatContainer from '../components/ChatContainer';
import FriendsContainer from '../components/FriendsContainer';
import { useSelector } from 'react-redux';
import { selectCurrentSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import EmptyChatContainer from '../components/EmptyChatContainer';
import { useSocket } from '../context/SocketContext';
import VideoCallModal from '../components/VideoCallModal/VideoCallModal';
function Chat() {
  const isUserSelected = useSelector(selectCurrentSelectedUser);
  const {IncomingCall, Caller, callercanceledcall, callercanceleddata} = useSocket();
  const [VideoModal, setVideoModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Get Ready");

  useEffect(() => {
      console.log(IncomingCall);
      if (IncomingCall) {
      setVideoModal(true);

      }else{
          setVideoModal(false);
      }
    }, [IncomingCall]);

    useEffect(() => {
      if (callercanceledcall) {
      setVideoModal(false);
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
      }
    }, [callercanceledcall]);

  return (
    <div className="Chat">
      <Navbar/>
      <div className='Chat2'>
        <FriendsContainer/>
        {/* {showNotification && (
        <Notification notificationMessage={notificationMessage} />
      )} */}
        {isUserSelected ?  <ChatContainer/> : <EmptyChatContainer/>}
      {VideoModal && (
                <VideoCallModal Caller={Caller} shouldCleanup={!VideoModal}/>
        )}
      </div>
    </div>
  )
}

export default Chat