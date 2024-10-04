import React, { useEffect, useState } from 'react'
import { useGetUserMutation, useSendLogoutMutation } from '../auth/authApiSlice'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Chat() {
    const navigate = useNavigate();
    const [getuser, {isLoading}] = useGetUserMutation();
    const [logout, {isLoadinglogout}] = useSendLogoutMutation();
    const [data, setData] = useState('');


    const handlegetdetails = async()=>{
      const data = await getuser().unwrap()
      console.log(data)
      setData(data);
    }

    const handlelogout = async()=>{
      const data = await logout().unwrap()
      navigate("/login");
      console.log(data);
    }

    

  return (
    <div className="container">
      <Navbar/>
      <div className="login">

        <div>Chat</div>
        <div className="div">
            <h1>
              email: {data.username}
              profilepic:
              <img
            src={data.ProfilePic}
            alt="Uploaded Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            />
            </h1>
            <button onClick={()=>handlegetdetails()}>getDetails</button>
            <button onClick={()=>handlelogout()}>logout</button>
        </div>

            </div>
    </div>
  )
}

export default Chat