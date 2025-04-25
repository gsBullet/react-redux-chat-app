import { apiSlice } from "../api/apiSlice";
import io from "socket.io-client";
export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_LIMIT}`,

      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
        });

        try {
          await cacheDataLoaded;
          socket.on("messages", async (data) => {
            updateCachedData((draft) => {
              draft.push(data.data);
            });
          });
        } catch (error) {
          console.log("socket io problem", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
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
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
