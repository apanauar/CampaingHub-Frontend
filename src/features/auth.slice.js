import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token"),
    usuario: JSON.parse(localStorage.getItem("usuario"))
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        iniciarSesion: (state, action) => {
            state.token = action.payload.token;
            state.usuario = action.payload.usuario;
        },
        actualizarPlan: (state, action) => {
            state.token = action.payload.token;
            state.usuario = action.payload.usuario;
        },
        cerrarSesion: (state) => {
            state.token = null;
            state.usuario = null;
        }
    }
})

export const { iniciarSesion, actualizarPlan, cerrarSesion } = authSlice.actions;
export default authSlice.reducer;