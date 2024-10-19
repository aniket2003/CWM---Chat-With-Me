import { apiSlice } from "../api/apiSlice";
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
          const { data } = await queryFulfilled;
          await handleAuth(data, dispatch);
          // dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),
    // -------------------------------------------------

    loginWithGoogle: builder.mutation({
      query: (credentials) => ({
        url: `api/auth/GoogleOAuth?code=${credentials}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await handleAuth(data, dispatch);
          // dispatch(apiSlice.util.resetApiState());
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
    }),

    // -------------------------------------------------

    FindUsers: builder.mutation({
      query: (searchTerm) => ({
        url: "api/auth/FindUsers",
        method: "POST",
        body: { searchTerm },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("getting2");
          await queryFulfilled;
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------

    GetFriends: builder.mutation({
      query: () => ({
        url: "api/auth/GetFriends",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const friends = await queryFulfilled;
          console.log(friends);
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------

    IsAFriend: builder.mutation({
      query: (data) => ({
        url: "api/auth/isafriend",
        method: "POST",
        body: { ...data },
      }),
    }),

    // -------------------------------------------------

    ReadAllMessages: builder.mutation({
      query: (data) => ({
        url: "api/auth/ReadAllMessages",
        method: "POST",
        body: { ...data },
      }),
    }),

    // -------------------------------------------------

    SendFile: builder.mutation({
      query: (formData) => ({
        url: "api/auth/SendFile",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log(data);
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------

    Message: builder.mutation({
      query: (data) => ({
        url: "api/auth/Message",
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log(data);
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------

    AddFriend: builder.mutation({
      query: (data) => ({
        url: "api/auth/AddFriend",
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const friends = await queryFulfilled;
          console.log(friends);
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),

    // -------------------------------------------------

    DeleteFriend: builder.mutation({
      query: (data) => ({
        url: "api/auth/deleteFriend",
        method: "POST",
        body: { ...data },
      }),
    }),

    // -------------------------------------------------

    getMessages: builder.mutation({
      query: (data) => ({
        url: "api/auth/getMessages",
        method: "POST",
        body: { ...data },
      }),
    }),

    // -------------------------------------------------

    sendLogout: builder.mutation({
      query: () => ({
        url: "api/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await handleAuth(data, dispatch);
        } catch (err) {
          console.log("Error: ", err);
        }
      },
    }),
  }),
});

const handleAuth = async (data, dispatch) => {
  console.log("data: ", data);
  dispatch(setCredentials({ accessToken: data.authtoken, user: null }));
  const UserInfo = await dispatch(
    authApiSlice.endpoints.getUser.initiate()
  ).unwrap();
  dispatch(setCredentials({ accessToken: data.authtoken, user: UserInfo }));
};

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useGetUserMutation,
  useFindUsersMutation,
  useGetFriendsMutation,
  useAddFriendMutation,
  useIsAFriendMutation,
  useGetMessagesMutation,
  useDeleteFriendMutation,
  useSendFileMutation,
  useMessageMutation,
  useReadAllMessagesMutation,
} = authApiSlice;
