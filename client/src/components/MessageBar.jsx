import { React, useState } from "react";
import "../css/Chat.css";

import { useSocket } from "../context/SocketContext";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { selectCurrentSelectedUser } from "../redux/selecteduser/selecteduserSlice";
import {
  useMessageMutation,
  useSendFileMutation,
} from "../redux/auth/authApiSlice";

const MessageBar = () => {
  const { socket } = useSocket();
  const [Message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const CurrentUser = useSelector(selectCurrentUser);
  const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
  const [sendFile, { SendingFile }] = useSendFileMutation();
  const [storeMessage, { StoringMessage }] = useMessageMutation();
  const [sendFileLoader, setSendFileLoader] = useState(false);

  const handleMessage = (data) => {
    setMessage(data.target.value);
  };

  const handleFile = (data) => {
    const formData = new FormData();
    formData.append("file", data.target.files[0]);
    setFile(formData);
  };

  const cancelFileSelection = () => {
    setFile(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSendMessage = async (data) => {
    data.preventDefault();

    if (file) {
      setSendFileLoader(true);
      try {
        const response = await sendFile(file).unwrap();
        if (response.status) {
          const FileUrl = response.url;

          socket.current.emit("send-file", {
            messageType: "file",
            from: CurrentUser._id,
            to: CurrentSelectedUser._id,
            FileUrl: FileUrl,
          });
        } else {
          console.log("Could not upload the file !");
        }
      } catch (err) {
        console.log(err);
      }
      setSendFileLoader(false);
      cancelFileSelection();
    } else if (Message.trim() !== "") {
      const message = Message;
      setMessage("");
      socket.current.emit("send-message", {
        message: message,
        messageType: "text",
        from: CurrentUser._id,
        to: CurrentSelectedUser._id,
      });
      try {
        const from = CurrentUser._id;
        const to = CurrentSelectedUser._id;
        const response = await storeMessage({ from, to, message }).unwrap();
        if (response.status) {
          console.log("Message Stored Successfully");
        } else {
          console.log("Message could not be stored");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div
      className="MessageBarParent"
      style={{
        marginBottom: "30px",
      }}
    >
      <form className="MessageBar" onSubmit={handleSendMessage}>
        {file ? (
          <div className="file-info">
            <div className="fileDetails">
              <span className="file-name">{file.get("file").name}</span>
              <span className="file-size">
                {file.get("file").size / (1024 * 1024) < 1
                  ? (file.get("file").size / 1024).toFixed(2) + " KB"
                  : (file.get("file").size / (1024 * 1024)).toFixed(2) + " MB"}
              </span>
            </div>
            <button
              type="button"
              className="cancel-button"
              onClick={cancelFileSelection}
              disabled={sendFileLoader}
              style={{ display: sendFileLoader ? "none" : "block" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="file-input" className="custom-file-upload">
              <img
                src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728118283/CWM/Icons/emfptawwoash28pp7hoo.png"
                alt="paperclip icon"
                style={{ display: sendFileLoader ? "none" : "block" }}
              />
            </label>
            <input
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={sendFileLoader}
            />

            <input
              type="text"
              placeholder="Message"
              className="MessageBarcustom-input"
              value={Message}
              onChange={handleMessage}
              disabled={file !== null || sendFileLoader}
              style={{ display: sendFileLoader ? "none" : "block" }}
            />
          </>
        )}

        {sendFileLoader && (
          <div className="loader-bar">
            <span>Uploading file...</span>
            <div className="progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        )}

        <button
          id="send-button"
          className="MessageBarButton"
          style={{ display: "none" }}
          type="submit"
          disabled={sendFileLoader}
        >
          Send
        </button>

        <label htmlFor="send-button" className="custom-file-upload">
          <img
            src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728119148/CWM/Icons/r3xcyiwjyuxktr5w8hrz.png"
            alt="send icon"
            onClick={handleSendMessage}
            style={{ display: sendFileLoader ? "none" : "block" }}

            // style={{ cursor: sendFileLoader ? "not-allowed" : "pointer" }}
          />
        </label>
      </form>
    </div>
  );
};

export default MessageBar;
