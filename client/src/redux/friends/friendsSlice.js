import { createSlice } from "@reduxjs/toolkit";

const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: [],
    },
    reducers:{
        setFriends(state, action){
            state.friends = action.payload;
        },

        addFriend(state, action){
            state.friends.push(action.payload);
        },

        removeFriend(state, action){
            state.friends = state.friends.filter(
                (friend)=>friend._id !== action.payload
            );
        },

        clearUnreadMessages(state, action){
            const { friendId } = action.payload;
            const friend = state.friends.find(
                (f)=>f._id === friendId
            );
            if(friend){
                friend.NumberofUnReadMessages = 0;
            }
        },

        NewMessageCount(state, action){
            const { friendId } = action.payload;
            const friend = state.friends.find(
                (f)=>f._id === friendId
            );
            if(friend){
                friend.NumberofUnReadMessages += 1;
            }
        }
    }
});


export const {setFriends, addFriend, removeFriend, clearUnreadMessages, NewMessageCount} = friendsSlice.actions;
export const selectFriendsList = (state)=> state.friends.friends;
export default friendsSlice.reducer;