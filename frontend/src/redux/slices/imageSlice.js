// frontend/src/redux/slices/imageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
    name: 'image',
    initialState: {
        file: null,
    },
    reducers: {
        setFile: (state, action) => {
            state.file = action.payload;
        },
    },
});

export const { setFile } = imageSlice.actions;
export default imageSlice.reducer;
