
// path: src/redux/slices/updateTriggerSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const updateTriggerSlice = createSlice({
  name: 'updateTrigger',
  initialState: {
    value: false,
  },
  reducers: {
    toggleUpdate: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleUpdate } = updateTriggerSlice.actions;

export default updateTriggerSlice.reducer;
