import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lista: []
}

const campaniasSlice = createSlice({
    name: 'campanias',
    initialState,
    reducers: {
        guardarCampanias: (state, action) => {
            state.lista = action.payload;
        },
        agregarCampania: (state, action) => {
            state.lista.push(action.payload);
        },
        eliminarCampania: (state, action) => {
            state.lista = state.lista.filter(c => c._id !== action.payload);
        },
        actualizarCampania: (state, action) => {
            state.lista = state.lista.map(c => c._id === action.payload._id ? action.payload : c);
        }
    }
})

export const { guardarCampanias, agregarCampania, eliminarCampania, actualizarCampania } = campaniasSlice.actions;
export default campaniasSlice.reducer;