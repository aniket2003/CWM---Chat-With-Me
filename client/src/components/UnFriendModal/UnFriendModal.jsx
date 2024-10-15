import { React, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../../redux/selecteduser/selecteduserSlice";
import { useAddFriendMutation, useDeleteFriendMutation } from "../../redux/auth/authApiSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import Loader from "../Loader";
const UnFriendModal = ({ isOpen, onClose, user }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const [LoaderLoading, setLoaderLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const [deleteFriend, {deleteFriendLoading}] = useDeleteFriendMutation();

  const UnFriend = async () => {
    try {
      setLoaderLoading(true);
      dispatch(setSelectedUser(null));
      const userid = currentUser._id;
      const friendid = user._id;
      const response = await deleteFriend({userid, friendid}).unwrap();
      socket.current.emit("DeleteFriend", ({
        username: currentUser.username,
        userid: userid,
        friendid: friendid
      }));
      if(response.status){
          console.log("Deleted");
          setLoaderLoading(false);
      }

    } catch (error) {
        console.log(error);
    }
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
            <div className="UnFriendModalParent">
              <div className="UnFriendModalChild">
                <p>Are you sure you want to Unfriend {user.username}?</p>
              </div>
            </div>
            <div className="UnFriendModalBtn">
              <button className="btn" onClick={onClose}>
                Cancel
              </button>

              <button className="btn" onClick={UnFriend}>
                Unfriend
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnFriendModal;
