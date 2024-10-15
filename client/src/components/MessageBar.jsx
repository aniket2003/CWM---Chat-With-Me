import {React, useState} from "react";
import "../css/Chat.css";

import { useSocket } from "../context/SocketContext";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { selectCurrentSelectedUser } from "../redux/selecteduser/selecteduserSlice";

const MessageBar = ()=> {
  const {socket}= useSocket();
  const [Message, setMessage] = useState("");
  const CurrentUser = useSelector(selectCurrentUser);
  const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);

  
  const handleMessage = (data)=>{
    setMessage(data.target.value);
  }
  
  
  const handleSendMessage = (data)=>{
    data.preventDefault();
    if(Message.trim() !== "" ){
      socket.current.emit("message",{
        message : Message,
        messageType : "text",
        from: CurrentUser._id,
        to: CurrentSelectedUser._id,
      });
      setMessage("");
      
    }
  }


  return (
    <div className="MessageBarParent" style={{
      'marginBottom': '30px'
  }}>
      <form className="MessageBar" onSubmit={handleSendMessage}>


        <label htmlFor="file-input" className="custom-file-upload">
          <img
            src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728118283/CWM/Icons/emfptawwoash28pp7hoo.png"
            alt="paperclip icon"
          />
        </label>
        <input id="file-input" type="file" style={{'display': 'none'}} />


        <input type="text" placeholder="Message" className="MessageBarcustom-input" value = {Message} onChange={handleMessage}/>



        <button id="file-input" className="MessageBarButton" style={{'display': 'none'}} type="submit">Send</button>
        <label htmlFor="button" className="custom-file-upload"> 
          <img
            src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728119148/CWM/Icons/r3xcyiwjyuxktr5w8hrz.png"
            alt="send icon"
            onClick={handleSendMessage}
            />
        </label>



      </form>
    </div>
  );
}

export default MessageBar;
