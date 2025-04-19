import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";
import io from "socket.io-client";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATION_LIMIT}`,
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("conversations", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.find((d) => d.id == data.data.id);
              if (conversation.id) {
                conversation.message = data.data.message;
                conversation.timestamp = data.data.timestamp;
              }
              //  else {
              //   draft.push(data.data);
              // }
            });
          });
        } catch (error) {
          console.log("socket io problem", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ data, sender }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;

        // Update cache for conversations for this user (assumes sender is part of arg or response)
        const pathResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const existing = draft.find((c) => c.id == conversation.data.id);

              if (!existing) {
                draft.unshift(conversation);
              }
            }
          )
        );

        try {
          if (conversation?.data?.id) {
            const senderUser = arg.data.users.find(
              (user) => user.email === arg.sender
            );
            const receiverUser = arg.data.users.find(
              (user) => user.email !== arg.sender
            );
            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            );
          }
        } catch (err) {
          pathResult.undo();
          console.error("Error adding message:", err);
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // Optimistically update the cache start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftResult = draft.find((c) => c.id == arg.id);
              if (draftResult) {
                draftResult.message = arg.data.message;
                draftResult.timestamp = arg.data.timestamp;
              }
            }
          )
        );
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const senderUser = arg.data.users.find(
              (user) => user.email === arg.sender
            );
            const receiverUser = arg.data.users.find(
              (user) => user.email !== arg.sender
            );
            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();
            // Update the messages cache for the conversation
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res?.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
          }
        } catch (err) {
          patchResult.undo();
          console.error("Error editing conversation:", err);
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
