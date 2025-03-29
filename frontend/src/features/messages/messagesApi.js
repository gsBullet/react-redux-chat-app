import { apiSlice } from "../api/apiSlice";
let limit = process.env.REACT_APP_CONVERSTION_LIMIT || 10;

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${limit}`,
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
