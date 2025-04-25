import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";
import io from "socket.io-client";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATION_LIMIT}`,
      transformResponse(apiResponse, meta) {
        const totalCount = meta.response.headers.get("x-total-count");
        return {
          data: apiResponse,
          totalCount,
        };
      },
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
          socket.on("conversations", async (data) => {
            updateCachedData((draft) => {
              const conversation = draft.data.find(
                // eslint-disable-next-line eqeqeq
                (d) => d._id == data.data._id
              );
              if (conversation?._id) {
                conversation.message = data.data.message;
                conversation.timestamp = data.data.timestamp;
              } else {
                draft.data.push(data.data);
              }
            });
          });
        } catch (error) {
          console.log("socket io problem", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),

    getMoreConversations: builder.query({
      query: ({ email, page }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_CONVERSATION_LIMIT}`,

      async onQueryStarted({ email }, { queryFulfilled, dispatch }) {
        // Optimistically update the cache start
        const conversations = await queryFulfilled;
        if (conversations.data.length > 0) {
          dispatch(
            apiSlice.util.updateQueryData(
              "getConversations",
              email,
              (draft) => {
                return {
                  data: [...draft.data, ...conversations.data],
                  totalCount: Number(draft.totalCount),
                };
              }
            )
          );
        }
      },
    }),

    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversation?participants_like=${userEmail}-${participantEmail}&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ data, sender }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;

        // Optimistically update the cache start
        const pathResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              draft.data.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
              );
            }
          )
        );

        try {
          if (conversation?.data?.conversation?._id) {
            const senderUser = arg.data.users.find(
              (user) => user.email === arg.sender
            );
            const receiverUser = arg.data.users.find(
              (user) => user.email !== arg.sender
            );

            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.conversation?._id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            );
          }
        } catch (err) {
          pathResult.undo();
          console.log("Error adding message:", err);
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ _id, data, sender }) => ({
        url: `/conversations/${_id}`,
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
              // eslint-disable-next-line eqeqeq
              const draftResult = draft.data.find((c) => c._id == arg._id);
              if (draftResult) {
                draftResult.message = arg.data.message;
                draftResult.timestamp = arg.data.timestamp;
              }

              draft.data.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
              );
            }
          )
        );

        const conversation = await queryFulfilled;
        try {
          if (conversation?.data?._id) {
            const senderUser = arg.data.users.find(
              (user) => user.email === arg.sender
            );
            const receiverUser = arg.data.users.find(
              (user) => user.email !== arg.sender
            );
            await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?._id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();

            // Update the messages cache for the conversation
            // dispatch(
            //   apiSlice.util.updateQueryData(
            //     "getMessages",
            //     res?.conversationId,
            //     (draft) => {
            //       draft.push(res);
            //     }
            //   )
            // );
          }
        } catch (err) {
          patchResult.undo();
          console.log("Error editing conversation:", err);
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMoreConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
