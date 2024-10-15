import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
    },
    reducers: {
        setCredentials: (state, action)=>{
            console.log("Action:", action.payload)
            const { accessToken, user } = action.payload
            state.token = accessToken
            state.user = user;
        },
        logOut: (state) =>{
            state.token = null;
            state.user = null;
        }
    }
})


export const {setCredentials, logOut} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user