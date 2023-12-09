import { createSlice } from "@reduxjs/toolkit";

const publishStore = createSlice({
  name: "publish",
  initialState: {
    count: 0,
  },

  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
});

const { increment, decrement } = publishStore.actions;
const reducer = publishStore.reducer;

export { increment, decrement };
export default reducer;
