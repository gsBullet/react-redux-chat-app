import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_LIMIT}`,
      async onQueryStarted({ id }, { queryFulfilled, dispatch }) {

        const messages = await queryFulfilled;
        console.log(`messages update`, messages);
      }
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: `/messages`,
        method: "POST",
        headers: {
          "content-type": "application/json",       
        },
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Message saved successfully:", data);
        } catch (err) {
          console.error("Message save failed:", err);
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
