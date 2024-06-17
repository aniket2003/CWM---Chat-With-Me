import React, { useEffect, useState } from 'react'
import { useGetUserMutation, useSendLogoutMutation } from '../auth/authApiSlice'

function Chat() {

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
      console.log(data);
    }

    

  return (
    <div className="container">
        <div>Chat</div>
        <div className="div">
            <h1>
              email: {data.username}
            </h1>
            <button onClick={()=>handlegetdetails()}>getDetails</button>
            <button onClick={()=>handlelogout()}>logout</button>
        </div>

    </div>
  )
}

export default Chat