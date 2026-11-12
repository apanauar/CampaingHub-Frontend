import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lista: []
}

const tiposSlice = createSlice({
    name: 'tipos',
    initialState,
    reducers: {
        guardarTipos: (state, action) => {
            state.lista = action.payload;
        },
        agregarTipo: (state, action) => {
            state.lista.push(action.payload);
        },
        eliminarTipo: (state, action) => {
            state.lista = state.lista.filter(t => t._id !== action.payload);
        },
        actualizarTipo: (state, action) => {
            state.lista = state.lista.map(t => t._id === action.payload._id ? action.payload : t);
        }
    }
})

export const { guardarTipos, agregarTipo, eliminarTipo, actualizarTipo } = tiposSlice.actions;
export default tiposSlice.reducer;