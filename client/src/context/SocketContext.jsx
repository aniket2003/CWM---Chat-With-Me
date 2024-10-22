import { createContext, useContext, useEffect, useRef, useState} from "react";
import { host } from "../utils/APIRoute";
import {io} from "socket.io-client";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/selecteduser/selecteduserSlice";
import { selectCurrentSelectedUser } from "../redux/selecteduser/selecteduserSlice";
import { NewMessageCount, clearUnreadMessages, selectFriendsList } from "../redux/friends/friendsSlice";
import { useReadAllMessagesMutation } from "../redux/auth/authApiSlice";
// import VideoCallModal from "../components/VideoCallModal/VideoCallModal";
const SocketContext = createContext({
    socket: null,
    friendAdded: null,
    deletefriend: null,
    newMessage: null,
    IncomingCall: false,
    Caller: null,
    closeModal: () => {},
});

// const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children})=>{
    const socket = useRef(null);
    const UserInfo = useSelector(selectCurrentUser);
    const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
    const [friendAdded , setFriendAdded] = useState(null);
    const [deletefriend , setdeletefriend] = useState(null);
    const [readallmessages, {isReading}] = useReadAllMessagesMutation();
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState(null);
    const fr = useSelector(selectFriendsList);
    const [IncomingCall, setIncomingCall] = useState(false);
    const [Caller, setCaller] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callerPeerId, setCallerPeerId] = useState(null);
    const [callercanceledcall, setCallerCanceledCall] = useState(false);
    const [receivercanceledcall, setReceiverCanceledCall] = useState(false);
    const [callercanceleddata , setCallerCanceledData] = useState(null);

    useEffect(()=>{

            if(UserInfo){

                socket.current = io(host,{
                    withCredentials: true,
                    query: {userId: UserInfo._id},
                });
                socket.current.on("connect", ()=>{
                    console.log("Connected to socket server");
                });

                socket.current.on("AddFriend", (data)=>{
                    setFriendAdded(data);
                })

                socket.current.on("DeleteFriend", (data)=>{
                    if(data.friend){
                        dispatch(setSelectedUser(null));
                    }
                    setdeletefriend(data);
                })

                socket.current.on("receiveMessage", (data) => {
                    setNewMessage(data);
                  });

                socket.current.on("new-message",async(data) => {
                    const {from} = data;
                    if(CurrentSelectedUser?._id === from){
                        dispatch(clearUnreadMessages({friendId: from}));
                        setTimeout(async () => {
                            const to = UserInfo._id;
                            const resp = await readallmessages({ from, to }).unwrap();
                            if (resp.status) {
                              console.log("Read");
                            }
                          }, 2000); 
                    }else{
                        dispatch(NewMessageCount({friendId: from}));
                    }
                  });

                socket.current.on("incoming-call", (data)=>{
                    setIncomingCall(true);
                    setCaller(data);
                })

                socket.current.on("call-accepted", (data)=>{
                    const {from, peerId} = data;
                    setCallAccepted(true);
                    setCallerPeerId(peerId);
                })

                socket.current.on("user-cancel-call", (data)=>{
                    const {from, to , username, caller} = data;
                    if(caller){
                        setCallerCanceledCall(true);
                    }else{
                        setReceiverCanceledCall(true);
                    }
                    setCallerCanceledData(data);
                })
                
                return ()=>{
                    if(socket.current){
                        socket.current.disconnect();
                    }
                };
            }

    },[UserInfo, CurrentSelectedUser]);

    const closeModal = ()=>{
        setIncomingCall(false);
    }

    return (
        <SocketContext.Provider value={{socket, friendAdded, deletefriend, newMessage, IncomingCall, Caller ,closeModal, callAccepted, callerPeerId, callercanceledcall, receivercanceledcall, callercanceleddata}}>
            {children}
        </SocketContext.Provider>
    );
}