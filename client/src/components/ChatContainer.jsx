import {React, useState} from 'react'
import "../css/Chat.css";
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer';
import MessageBar from './MessageBar';
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