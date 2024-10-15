import { createContext, useContext, useEffect, useRef, useState} from "react";
import { host } from "../utils/APIRoute";
import {io} from "socket.io-client";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/selecteduser/selecteduserSlice";
import { selectCurrentSelectedUser } from "../redux/selecteduser/selecteduserSlice";
const SocketContext = createContext(null);


export const useSocket = () =>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children})=>{
    const socket = useRef(null);
    const UserInfo = useSelector(selectCurrentUser);
    const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
    const [friendAdded , setFriendAdded] = useState(null);
    const [deletefriend , setdeletefriend] = useState(null);
    const dispatch = useDispatch();

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

                
                return ()=>{
                    if(socket.current){
                        socket.current.disconnect();
                    }
                };
            }

    },[UserInfo]);

    return (
        <SocketContext.Provider value={{socket, friendAdded, deletefriend}}>
            {children}
        </SocketContext.Provider>
    );
}