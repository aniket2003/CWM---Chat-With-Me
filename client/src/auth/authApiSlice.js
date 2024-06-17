import { apiSlice } from "../redux/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const  {data}  = await queryFulfilled;
          console.log(data)
          dispatch(setCredentials({ accessToken: data.authtoken }));
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),
    // -------------------------------------------------

    getUser: builder.mutation({
      query: () => ({
        url: "api/auth/getuser",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------
    sendLogout: builder.mutation({
      query: (credentials) => ({
        url: "api/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log("authApiSlice: ", data);
          dispatch(logOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "api/auth/refresh",
        method: "GET",
      }),
      // console.log(credentials);
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled;
          console.log("authApiSlice: refresh : ", data);
          const {accessToken} = data;
          dispatch(setCredentials({accessToken}));
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation, useGetUserMutation } =
  authApiSlice;
