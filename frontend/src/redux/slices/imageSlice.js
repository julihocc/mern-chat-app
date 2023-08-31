// frontend/src/redux/slices/imageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
    name: 'image', // Name of the slice
    initialState: {
        file: null, // Initially, no single file is present
        files: [],  // Initially, no multiple files are present
        loading: false, // Not loading by default
        error: null, // No errors by default
    },
    reducers: {
        // Start loading when an asynchronous action is pending
        startLoading: (state) => {
            state.loading = true;
        },
        // Reducer for setting a single file
        setFile: (state, action) => {
            // Validate the file here, if needed
            state.file = action.payload; // Set the single file in the state
            state.loading = false; // Loading completed
            state.error = null; // Clear any errors
        },
        // Reducer for setting multiple files
        setFiles: (state, action) => {
            // Validate the files here, if needed
            state.files = action.payload; // Set the multiple files in the state
            state.loading = false; // Loading completed
            state.error = null; // Clear any errors
        },
        // Reducer for handling errors
        setError: (state, action) => {
            state.error = action.payload; // Set the error message
            state.loading = false; // Loading completed
        }
    },
});

// Export actions to be used elsewhere
export const {
    startLoading,
    setFile,
    setFiles,
    setError
} = imageSlice.actions;

// Export the reducer for combining with other slices
export default imageSlice.reducer;
