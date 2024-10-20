import React, { useEffect, useState } from "react";
import "../css/Chat.css";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";
import {
  useGetFriendsMutation,
  useReadAllMessagesMutation,
} from "../redux/auth/authApiSlice";
import Loader from "./Loader";
import {
  selectCurrentSelectedUser,
  setSelectedUser,
} from "../redux/selecteduser/selecteduserSlice";
import { setFriends, addFriend, removeFriend, selectFriendsList, clearUnreadMessages } from "../redux/friends/friendsSlice";
import { useDispatch } from "react-redux";
import { useSocket } from "../context/SocketContext";
import Notification from "./Notification";
import { v4 as uuidv4 } from "uuid";
function FriendsContainer() {
  const user = useSelector(selectCurrentUser);
  const CurrentSelectedUser = useSelector(selectCurrentSelectedUser);
  const dispatch = useDispatch();
  const [getfriends, { isLoading }] = useGetFriendsMutation();
  const friends = useSelector(selectFriendsList);
  const [loading, setLoading] = useState(false);
  const { friendAdded, deletefriend, socket } = useSocket();
  const [readallmessages, isReading] = useReadAllMessagesMutation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Get Ready");

  useEffect(() => {
    if (friendAdded != null) {
      dispatch(addFriend(friendAdded));
      if (!friendAdded.append) {
      // dispatch(addFriend(friendAdded));
        setNotificationMessage(`${friendAdded.username} Added you as a Friend`);
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 6000);
      }
    }
  }, [friendAdded]);

  useEffect(() => {
    if (deletefriend != null) {
      if (deletefriend.friend) {
        dispatch(removeFriend(deletefriend.userid));
        setNotificationMessage(`${deletefriend.username} UnFriended you !`);
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 6000);
      } else {
        dispatch(removeFriend(deletefriend.friendid));
      }
    }
  }, [deletefriend]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const friends = await getfriends().unwrap();
      setLoading(false);
      dispatch(setFriends(friends));
    };
    fetch();
  }, [user]);

  const sortedFriends = [...friends].sort((a,b)=>b.NumberofUnReadMessages - a.NumberofUnReadMessages)

  const selectUser = async (selecteduser) => {
    const UserFormat = {
      _id: selecteduser._id,
      username: selecteduser.username,
      email: selecteduser.email,
      ProfilePic: selecteduser.ProfilePic,
      bio: selecteduser.bio,
    };
    const from = selecteduser._id;
    const to = user._id;
    dispatch(clearUnreadMessages({friendId: from}));
    await readallmessages({ from, to }).unwrap();
    dispatch(setSelectedUser(UserFormat));
  };

  return (
    <div className="FriendsContainer">
      <h3>Friends</h3>
      {loading && <Loader />}
      {showNotification && (
        <Notification notificationMessage={notificationMessage} />
      )}

      <div className="FoundedUsers">
        {sortedFriends.length > 0 ? (
          sortedFriends.map((user) => (
            <div
              key={uuidv4()}
              className="FoundedUserListCard"
              onClick={() => selectUser(user)}
            >
              <img src={user.ProfilePic} className="FoundedUserProfilePic" />
              <div className="FoundedUserUsernameEmail">
                <p>{user.username}</p>
                <p>{user.email}</p>
              </div>
              {
                user.NumberofUnReadMessages > 0 &&(
                  <span className="unread-count">{user.NumberofUnReadMessages}</span>
                )

              }
            </div>
          ))
        ) : (
          <p>No Friends</p>
        )}
      </div>
      {/* <h3>Groups</h3> */}
    </div>
  );
}

export default FriendsContainer;
