import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketContext';
import Peer from "peerjs";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/auth/authSlice';
function VideoCallModal({Caller}) {

    const {socket, closeModal} = useSocket();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [callAccepted, setCallAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [peerInstance, setPeerInstance] = useState(null);
    const UserInfo = useSelector(selectCurrentUser);
    
    const handleAcceptCall = ()=>{
        setCallAccepted(true);
        setLoading(true);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
      
            const peer = new Peer();
            setPeerInstance(peer);
            peer.on("open", (peerId) => {
              socket.current.emit("accept-video-call", { senderId: Caller.from, peerId });
            });

            peer.on("call", (call)=>{

                call.answer(stream);
                call.on("stream", (remotestream)=>{
                    if(remoteVideoRef.current){
                        remoteVideoRef.current.srcObject = remotestream;
                    }
                    setLoading(false);
                });

            })
          }).catch((error)=>{
            console.error("Error Accessing the media devices: ", error);
            setLoading(false);
          });

    };

    const handleRejectCall = ()=>{

        socket.current.emit("reject-call", {
            from: Caller.to,
            to: Caller.from,
        });
        closeModal();

    }

    const handleCancelCall = ()=>{
        if(peerInstance){
            peerInstance.destroy();
            localVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
            remoteVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
        }

        socket.current.emit("cancel-call", {
            from: Caller.to,
            to: Caller.from,
            username: UserInfo.username,
            caller: false,
        });

        closeModal();
    }


    useEffect(() => {
      return () => {
        localVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
        remoteVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
        if (peerInstance) {
          peerInstance.destroy();
        }
      };
    }, [peerInstance]);



  return (
    <div className="videocallmodal-overlay">
    <div className="videocallmodal-content">
      {loading && <p>Connecting...</p>}

          {callAccepted && (
      <div className="VideoCallOn">
        <div className="MyVideo">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '300px', height: '300px' }}
          ></video>
          <h3>You</h3>
          </div>

            <div className="FriendsVideo">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: '300px', height: '300px' }}
            ></video>
            <h3>{Caller.username}</h3>
             </div>

             <button className="cancel-btn" onClick={handleCancelCall} >Cancel Call</button>
      </div>
        )}

      {!callAccepted && (
        <div className="CallAcceptReject">
          <p>{Caller?.username} is calling you!</p>
          <button className="accept-btn" onClick={handleAcceptCall}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleRejectCall}>
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
  )
}

export default VideoCallModal