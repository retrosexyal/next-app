import { IUser } from "@/clientModels/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  user: IUser;
}

const initialState: UserState = {
  user: {
    email: "",
    name: "",
    isActivated: false,
    id: "",
    status: "",
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
