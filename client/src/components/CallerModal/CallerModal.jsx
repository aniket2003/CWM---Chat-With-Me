import React, {useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketContext'
import Peer from "peerjs";
import Loader from '../Loader';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/auth/authSlice';
import { selectCurrentSelectedUser } from '../../redux/selecteduser/selecteduserSlice';
function CallerModal({myPeer, onClose}) {

    const {callAccepted, callerPeerId} = useSocket();
    const [loading, isLoading] = useState(true);
    var localVideoRef = useRef();
    var remoteVideoRef = useRef(null);
    const {socket} = useSocket();
    const UserInfo = useSelector(selectCurrentUser);
    const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
    useEffect(()=>{

        if(callAccepted){

            if(callerPeerId){
                isLoading(false);
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    localVideoRef.current.srcObject = stream;
                    var call = myPeer.call(callerPeerId, stream);
                    call.on("stream", (remoteStream) => {
                        console.log("calling");
                        console.log(remoteVideoRef);
                      remoteVideoRef.current.srcObject = remoteStream;
                    });
                  });

            }

        }

    },[callAccepted])


    const handleCancelCall = ()=>{
        if(myPeer){
            myPeer.destroy();
            localVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
            remoteVideoRef.current.srcObject.getTracks().forEach(track=> track.stop());
        }

        socket.current.emit("cancel-call", {
            from: UserInfo._id,
            to: CurrentSelectedUser._id,
            username: UserInfo.username,
            caller: true,
        });

        onClose();
    }

  return (
    <div className="videocallmodal-overlay">
    <div className="videocallmodal-content">
        {loading ? (<Loader/>) : (
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
                  <h3>{CurrentSelectedUser.username}</h3>
                   </div>
          
                   <button className="cancel-btn" onClick={handleCancelCall} >Cancel Call</button>
            </div>
        )}     
    </div>
  </div>

  )
}

export default CallerModal