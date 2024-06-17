import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {setCredentials} from '../../auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    credentials: 'include',
    prepareHeaders: (headers, {getState})=>{
        const token = getState().auth.token
        if(token){
            headers.set("authorization",`Bearer ${token}`)
        }
        return headers
    }
})


const baseQueryWithReauth = async (args, api, extraOptions)=>{

    let result = await baseQuery(args, api, extraOptions)
    if(result?.error?.status === 403){
       console.log("trying...")
        const refreshres = await baseQuery('api/auth/refresh', api,extraOptions)
        if(refreshres?.data){
            api.dispatch(setCredentials({...refreshres.data}))
            console.log("done")
            result = await baseQuery(args, api, extraOptions)

        }else{
            if(refreshres?.error?.status === 403){
                refreshres.error.data.message = "Your login has expired."
            }
            return refreshres
        }
    }

    return result
}


export const apiSlice = createApi ({
    baseQuery: baseQueryWithReauth,
    tagTypes: [],
    endpoints: builder =>({})
})