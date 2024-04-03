import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stores: [],
  name: "store",
};

export const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
});

export const {} = storeSlice.actions;

export default storeSlice.reducer;
