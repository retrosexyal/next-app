import { IUser } from "@/clientModels/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: "",
    name: "",
    isActivated: false,
    id: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
