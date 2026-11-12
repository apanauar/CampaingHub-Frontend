import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import campaniasReducer from "../features/campanias.slice";
import tiposReducer from "../features/tipos.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        campanias: campaniasReducer,
        tipos: tiposReducer
    }
})