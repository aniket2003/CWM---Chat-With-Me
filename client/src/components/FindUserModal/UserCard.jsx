import { React, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../../redux/selecteduser/selecteduserSlice";
import { useAddFriendMutation } from "../../redux/auth/authApiSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import Loader from "../Loader";
const UserCardModal = ({ isOpen, onClose, onCloseAll,user, buttonMessage }) => {
  const navigate = useNavigate();
  const {socket} = useSocket();
  const dispatch = useDispatch();
  const [LoaderLoading, setLoaderLoading] = useState(false);
  const [addfriend, { isLoading }] = useAddFriendMutation();
  const currentUser = useSelector(selectCurrentUser);


  const AddFriend = async () => {
    dispatch(setSelectedUser(user));
    const userid = currentUser._id;
    const friendid = user._id;
    setLoaderLoading(true);
    // console.log(user);
    const data = await addfriend({userid ,friendid}).unwrap();
    setLoaderLoading(false);
    if (data.status) {
      socket.current.emit("AddFriend", ({
        from: currentUser._id,
        to: user._id,
        fromusername : currentUser.username,
        fromemail: currentUser.email,
        fromProfilePic: currentUser.ProfilePic,
        frombio: currentUser.bio,
        tousername: user.username,
        toemail: user.email,
        toProfilePic: user.ProfilePic,
        tobio: user.bio,
      }));
      // console.log("Selecting")
      onCloseAll();
    } else {
      console.log("Cannot Add Friend");
    }
  };

  const Message = async () => {
    dispatch(setSelectedUser(user));
    onCloseAll();
  };

  return (
    <div className="UserCardmodal-overlay" onClick={onClose}>
      <div
        className="UserCardmodal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        {LoaderLoading ? (
          <Loader />
        ) : (
          <>
            <div className="UserCardParent">
              <img
                src={user.ProfilePic}
                alt="Profile Pic"
                className="UserCardprofile-pic"
              />
              <div className="UserCardChild">
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p>{user.bio}</p>
              </div>
            </div>
            {buttonMessage ? (
              <button className="btn" onClick={Message}>
                Message
              </button>
            ) : (
              <button className="btn" onClick={AddFriend}>
                Add Friend
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserCardModal;
