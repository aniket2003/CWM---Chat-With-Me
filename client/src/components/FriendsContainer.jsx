import React, { useEffect, useState } from 'react'
import "../css/Chat.css";
import { selectCurrentUser } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import { useGetFriendsMutation } from '../redux/auth/authApiSlice';
import Loader from './Loader';
import { selectCurrentSelectedUser, setSelectedUser } from '../redux/selecteduser/selecteduserSlice';
import { useDispatch } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import Notification from './Notification';
function FriendsContainer() {

  const user = useSelector(selectCurrentUser); 
  const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
  const dispatch = useDispatch();
  const [getfriends, {isLoading}] = useGetFriendsMutation();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const {friendAdded, deletefriend ,socket} = useSocket();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('Get Ready');

  useEffect(()=>{
    if(friendAdded){
      console.log(friends);
      setFriends((prev) => [...prev, friendAdded]);
      if(!friendAdded.append){
        setNotificationMessage(`${friendAdded.username} Added you as a Friend`);
        setShowNotification(true);
        
        setTimeout(()=>{
          setShowNotification(false);
        }, 6000);
      
      }
    } 
  }, [friendAdded, CurrentSelectedUser]);


  useEffect(()=>{
    if(deletefriend){

      if(deletefriend.friend){
        setFriends((prev) => removeFriend(prev, deletefriend.userid));
        setNotificationMessage(`${deletefriend.username} UnFriended you !`);
        setShowNotification(true);
  
        setTimeout(()=>{
          setShowNotification(false);
        }, 6000);


      }else{
        setFriends((prev) => removeFriend(prev, deletefriend.friendid));
      }
    } 
  }, [deletefriend]);


  const removeFriend = (friends, id)=>{
    return friends.filter(friend=>friend._id !== id);
  }

  
  useEffect(()=>{
    
    const fetch = async()=>{
      setLoading(true);
      const friends = await getfriends().unwrap();
      setLoading(false);
      setFriends(friends);
    }
    fetch();
  }, [user, CurrentSelectedUser]);
  
    
  const selectUser = async(user)=>{
    const UserFormat = {
      _id: user._id,
      username: user.username,
      email: user.email,
      ProfilePic: user.ProfilePic,
      bio: user.bio,
    }
    dispatch(setSelectedUser(UserFormat));
  }

  // if(loading){
  //   return <Loader/>;
  // }

  return (
    <div className="FriendsContainer">
        <h3>Friends</h3>
          {loading && <Loader/>}
        {showNotification && <Notification notificationMessage={notificationMessage}/>}
        
        <div className="FoundedUsers">
            {friends.length>0 ? friends.map((user)=>(
                <div key={user._id} className="FoundedUserListCard" 
                onClick={()=>selectUser(user)}
                >
                  <img src={user.ProfilePic} className="FoundedUserProfilePic"/>
                  <div className="FoundedUserUsernameEmail">
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  </div>
                </div>
            ))
            :
            <p>No Friends</p>
            }
        </div>
        {/* <h3>Groups</h3> */}
    </div>
  )
}

export default FriendsContainer