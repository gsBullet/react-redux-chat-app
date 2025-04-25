import { apiSlice } from "../api/apiSlice";
// let limit = process.env.REACT_APP_USERS_LIMIT || 10;

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) => `/users/${email}`,
    }),
  }),
});

export const { useGetUserQuery } = usersApi;
