import {React, useState, useEffect} from 'react'
import "../css/Chat.css";
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer';
import MessageBar from './MessageBar';
import { useSocket } from '../context/SocketContext';
import VideoCallModal from './VideoCallModal/VideoCallModal';
function ChatContainer() {

    return (
        <div className="ChatContainer">
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar/>
        </div>
      );
}

export default ChatContainer