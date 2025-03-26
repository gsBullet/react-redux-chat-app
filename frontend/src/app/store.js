import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSliceReducer  from "../features/auth/authSlice";
import  messagesSliceReducer  from "../features/messages/messagesSlice";
import  converstionSliceReducer  from "../features/converstions/converstionsSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    converstions: converstionSliceReducer, // Add other slices here if needed.
    messages: messagesSliceReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  // Enable Redux DevTools in development mode only.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
});
