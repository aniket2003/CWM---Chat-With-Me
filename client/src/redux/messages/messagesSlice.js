import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
    name: 'messagesSlice',
    initialState: {
        messages: null,
    },
    reducers:{
        setMessages: (state, action)=>{
            const messages = action.payload;
            state.messages = messages;
        },
    }
});

export const {setMessages} = messagesSlice.actions
export default messagesSlice.reducer
export const getMessages = (state)=>state.messagesSlice.messages;