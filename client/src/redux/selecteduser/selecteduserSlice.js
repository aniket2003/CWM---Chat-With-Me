import {createSlice} from '@reduxjs/toolkit'

const selecteduserSlice = createSlice({
    name: 'selecteduser',
    initialState: {
        selecteduser: null,
    },
    reducers: {
        setSelectedUser: (state, action)=>{
            const user  = action.payload
            state.selecteduser = user;
        },
    }
})


export const {setSelectedUser} = selecteduserSlice.actions

export default selecteduserSlice.reducer

export const selectCurrentSelectedUser = (state) => state.selecteduser.selecteduser;