import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";
let limit = process.env.REACT_APP_CONVERSTION_LIMIT || 10;

export const converstionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConverstions: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${limit}`,
    }),

    getConverstion: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
    }),

    // getConversation: builder.query({
    //   query: (id) => `conversations/${id}`,
    // }),
    addConversation: builder.mutation({
      query: ({ data, sender }) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const conversation = await queryFulfilled;
        if (conversation?.data?.id) {
          const users = arg.data.users;
          const receiverUser = users.find((user) => user.email !== arg.sender);
          const senderUser = users.find((user) => user.email === arg.sender);

          await dispatch(
            messagesApi.endpoints.addMessages.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg.data.message,
              timestamp: arg.data.timestamp,
            })
          );
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const conversation = await queryFulfilled;
        if (conversation?.data?.id) {
          const users = arg.data.users;
          const receiverUser = users.find((user) => user.email !== arg.sender);
          const senderUser = users.find((user) => user.email === arg.sender);
          
        
          await dispatch(
            messagesApi.endpoints.addMessages.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg?.data?.message,
              timestamp: arg?.data?.timestamp,
            })
          );
        }
      },
    }),
    // deleteConversation: builder.mutation({
    //   query: (id) => ({
    //     url: `conversations/${id}`,
    //     method: "DELETE",
    //   }),
    //   onMutationSuccess: (dispatch, { getState, meta: { arg } }) => {
    //     dispatch(getConversations.fulfilled(getState().conversations));
    //   },
    // }),
    // sendMessage: builder.mutation({
    //   query: ({ conversationId, body }) => ({
    //     url: `conversations/${conversationId}/messages`,
    //     method: "POST",
    //     body,
    //   }),
    //   onMutationSuccess: (dispatch, { getState, meta: { arg } }) => {
    //     dispatch(getConversation.fulfilled(getState().conversations));
  }),
});

export const {
  useGetConverstionsQuery,
  useGetConverstionQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = converstionsApi;
