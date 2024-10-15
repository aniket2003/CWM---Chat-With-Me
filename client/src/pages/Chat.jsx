import React, { useEffect } from 'react';
import "../css/Chat.css";
import Navbar from '../components/Navbar';
import ChatContainer from '../components/ChatContainer';
import FriendsContainer from '../components/FriendsContainer';
import { useSelector } from 'react-redux';
import { selectCurrentSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import EmptyChatContainer from '../components/EmptyChatContainer';

function Chat() {
  const isUserSelected = useSelector(selectCurrentSelectedUser);
  return (
    <div className="Chat">
      <Navbar/>
      <div className='Chat2'>
        <FriendsContainer/>
        {isUserSelected ?  <ChatContainer/> : <EmptyChatContainer/>}
      </div>
    </div>
  )
}

export default Chat