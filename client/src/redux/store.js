import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./auth/authSlice";
import selecteduserReducer from "./selecteduser/selecteduserSlice";
import messagesSliceReducer from "./messages/messagesSlice";
import friendsReducer from "./friends/friendsSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        selecteduser: selecteduserReducer,
        messages: messagesSliceReducer,
        friends: friendsReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch)