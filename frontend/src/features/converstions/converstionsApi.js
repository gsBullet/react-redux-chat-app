import { apiSlice } from "../api/apiSlice";
let limit = process.env.REACT_APP_CONVERSTION_LIMIT || 10;

export const converstionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConverstions: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${limit}`,
    }),

    getConverstion: builder.query({
      query: ({ userEmail, partcipantEmail }) =>
        `/conversations?participants_like=${userEmail}-${partcipantEmail} || ${partcipantEmail}- ${userEmail}`,
    }),

    // getConversation: builder.query({
    //   query: (id) => `conversations/${id}`,
    // }),
    addConversation: builder.mutation({
      query: (data) => ({
        url: `conversations`,
        method: "POST",
        body: data,
      }),
    }),
    updateConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
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
  useUpdateConversationMutation,
} = converstionsApi;
