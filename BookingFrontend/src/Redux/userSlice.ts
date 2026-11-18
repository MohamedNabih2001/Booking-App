import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RefereshResponseType } from "../types/userTypes";
import { apiBooking } from "../api/axios";
import { redirect } from "react-router-dom";

interface UserType {
  name: string | null;
  email: string | null;
  role: string | null;
  theme: string | null;
  token: string | null;
  isLoading?: boolean | null;
}
interface ChangDataType {
  name?: string | null;
  role?: string | null;
  theme?: string | null;
}
//////////////////////////////////////

const initialState: UserType = {
  name: null,
  email: null,
  role: null,
  theme: null,
  token: null,
  isLoading: null,
};
//////////////////////////////////////

export const refreshToken = createAsyncThunk(
  "user/refresh",
  async (_, thunkAPI) => {
    try {
      const res = await apiBooking.get("/auth/refresh");
      return res.data as RefereshResponseType;
    } catch (err) {
      return thunkAPI.rejectWithValue(`Failed to Refresh token : ${err}`);
    }
  },
);

//////////////////////////////////////

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin(state, action: PayloadAction<UserType>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.theme = action.payload.theme;
      state.isLoading = false;
    },
    changeTheme(state, action: PayloadAction<ChangDataType>) {
      if (action.payload.name) {
        state.name = action.payload.name;
      }
      if (action.payload.role) {
        state.role = action.payload.role;
      }
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      }
    },

    logout(state) {
      state.name = null;
      state.email = null;
      state.role = null;
      state.token = null;
      state.theme = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.name = action.payload.data.name;
        state.email = action.payload.data.email;
        state.role = action.payload.data.role;
        state.token = action.payload.data.token;
        state.theme = action.payload.data.theme;
        state.isLoading = false;
      })
      .addCase(refreshToken.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.name = null;
        state.email = null;
        state.role = null;
        state.token = null;
        state.theme = null;
        state.isLoading = false;
        redirect("/");
      });
  },
});

export const { changeTheme, signin, logout } = userSlice.actions;
export default userSlice.reducer;
