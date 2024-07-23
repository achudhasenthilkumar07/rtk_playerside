import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { playerside } from "../feature/counter/Playerside.js";

export const store = configureStore({
    reducer : {
        [playerside.reducerPath] : playerside.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playerside.middleware),
})
setupListeners(store.dispatch)