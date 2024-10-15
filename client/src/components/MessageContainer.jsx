import { React, useEffect, useState, Fragment, useRef } from "react";
import "../css/Chat.css";
import { useSocket } from "../context/SocketContext";
import { useGetMessagesMutation } from "../redux/auth/authApiSlice";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { selectCurrentSelectedUser } from "../redux/selecteduser/selecteduserSlice";
import { getMessages, setMessages } from "../redux/messages/messagesSlice";
import { format } from "date-fns";
import {v4 as uuidv4} from 'uuid';

function MessageContainer() {
  const [conversation, { loadingConversations }] = useGetMessagesMutation();
  const [loading, setLoading] = useState(false);
  const from = useSelector(selectCurrentUser)._id;
  const selectedUser = useSelector(selectCurrentSelectedUser);
  const to = selectedUser._id;
  
  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const messagesEndRef = useRef(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "p");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "eeee, MMMM do");
  };

  useEffect(() => {
    if(!to)return;
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await conversation({ from, to }).unwrap();
        console.log(response)
        if(response?.conversations?.messages){
          setResult(response.conversations.messages);
        //   dispatch(setMessages(response.conversations));
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [to, from, conversation]);

  if(!to){
    return <Loader/>
  }

  const {socket}= useSocket();

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("receiveMessage", (data) => {
        setResult((prev) => [...prev, data]);
      });

      return () => {
        socket.current.off("receiveMessage");
      };
    }
  }, [socket]);



  const scrollToBottom = ()=>{
    messagesEndRef.current?.scrollIntoView({behaviour: "smooth"});
  }

  useEffect(()=>{
    scrollToBottom();
  },[result])

  let previousDate = null;

  return (
    <div className="MessageContainer">
      {result.length > 0
        ? result.map((message, index) => {
            const currentMessageDate = new Date(
              message.timestamp
            ).toDateString();
            const showDate = previousDate !== currentMessageDate;

            if (showDate) {
              previousDate = (currentMessageDate);
            }

            return (


              <Fragment  key={uuidv4()}>
              
              {showDate && <p className="dateDivider">{formatDate(message.timestamp)}</p>}
              
              
              {message.from === from ? (
                <div className="sendMessageContainer">
                <p className="sentMessage">
                {message.content}
              </p>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
                </div>
            ) : (
              <div className="receivedMessageContainer">
              <p className="receivedMessage">
                {message.content}
              </p>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
              </div>
            )}
            
            </Fragment>

          );
          })
        : null}

      {loading && <Loader />}

      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default MessageContainer;
