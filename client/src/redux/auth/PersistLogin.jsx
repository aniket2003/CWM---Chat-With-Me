import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

import React from 'react'

const PersistLogin = ()=>{

    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh,{
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    useEffect(()=>{
        if(effectRan.current === true || process.env.NODE_ENV !== 'development'){
            
            const verifyRefreshToken = async ()=>{
                console.log('Verifying the refresh token')
                try{
                    console.log(token)
                    await refresh()
                    setTrueSuccess(true)
                }catch(err){
                    console.log(err)
                }
            }

            if(!token && persist) verifyRefreshToken()
        }
      return () => effectRan.current = true;
    },[token, persist, refresh]);


    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }



  return content
}

export default PersistLogin