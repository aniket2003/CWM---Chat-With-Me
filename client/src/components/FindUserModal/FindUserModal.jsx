import {React, useState, useEffect} from "react";
import { useFindUsersMutation } from "../../redux/auth/authApiSlice";
import UserCardModal from "./UserCard";
import Loader from "../Loader"
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useIsAFriendMutation } from "../../redux/auth/authApiSlice";
const FindUserModal = ({ isOpen, onClose }) => {

  const [searchTerm , setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [foundUsers, {isLoading}] = useFindUsersMutation();
  const [isUserCardModalOpen, setUserCardModalopen] = useState(false);
  const [userToggled, setUserToggled] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isaFriend, {ischecking}] = useIsAFriendMutation();
  const [buttontext, setButtonText] = useState("Add Friend");
  const CurrentUser = useSelector(selectCurrentUser);
  useEffect(()=>{

    const delayDebounce = setTimeout(()=>{

        if(searchTerm){
            fetchUsers();
        }

    }, 500); // ==>> 500 ms ---- 0.5 seconds

    return ()=>clearTimeout(delayDebounce);

  }, [searchTerm]);

  const fetchUsers = async()=>{
    setIsLoaderActive(true);
    const Users = await foundUsers(searchTerm).unwrap();
    setIsLoaderActive(false);
    setResults(Users);
  }


  
  
  
  const toggleUserCardModal = async(user)=>{
    setUserToggled(user)
    const userid = CurrentUser._id;
    const friendid = user._id;
    const response = await isaFriend({userid, friendid}).unwrap();
    setButtonText(response.status);
    setUserCardModalopen(!isUserCardModalOpen);
  }

  const closeAllModals = ()=>{
    setUserCardModalopen(false);
    onClose();
  }

  const toggleCloseModel = ()=>{
    setUserCardModalopen(false);
  }



  return (
    <div className="modal-overlay" >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Find User</h2>
        <input type="text" placeholder="Find User" className="FindUserSearchUser"
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        />

        {isLoaderActive ? <Loader/> : 
        <div className="FoundedUsers">
            {results.map((user)=>(
              user._id !== CurrentUser._id ? (
              <div key={user._id} className="FoundedUserListCard" 
              onClick={()=>toggleUserCardModal(user)}
              >
                  <img src={user.ProfilePic} className="FoundedUserProfilePic"/>
                  <div className="FoundedUserUsernameEmail">
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  </div>
                </div>
              ): null
            ))

            }
        </div>
          }
      </div>
      {isUserCardModalOpen && (<UserCardModal isOpen={isUserCardModalOpen} onClose={toggleCloseModel} onCloseAll={closeAllModals} user={userToggled} buttonMessage={buttontext}/>)}
    </div>
  );
};

export default FindUserModal;
