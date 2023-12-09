import { configureStore } from "@reduxjs/toolkit";
// 导入子模块reducer
import publishReducer from "./modules/publishStore";

const store = configureStore({
  reducer: {
    publish: publishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
