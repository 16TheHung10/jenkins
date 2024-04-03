import { configureStore } from "@reduxjs/toolkit";
import StoreReducer from "./features/store/StoreSlice";
export const store = configureStore({
  reducer: { store: StoreReducer },
});
