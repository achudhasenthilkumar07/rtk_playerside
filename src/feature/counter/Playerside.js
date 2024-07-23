import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const playerside = createApi({
    reducerPath: 'playerside',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_UAT_URL, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
    endpoints: (builder) => ({
        GetSport: builder.query({
            query: () => ({
                url: '/api/v1/sport-photos',
                method: "GET"
            }),
        }),
        PostLogin: builder.mutation({
            query: (loginData) => ({
                url: "/api/user-management/login",
                method: "POST",
                body: loginData
            }),
        }),
        GetFacility: builder.mutation({
            query: (id) => ({
                url: `/api/facilities/count?sportId.equals=${id}`,
                method: "GET"
            }),
        })
    }),
});

export const { useGetFacilityMutation, usePostLoginMutation, useGetSportQuery } = playerside;