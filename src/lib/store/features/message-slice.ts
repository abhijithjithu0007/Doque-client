import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axios";
import { RootState } from "@/lib/store/index";

export type Message = {
  _id: string;
  messages: Array<{
    content: string;
    timestamp: string;
    _id: string;
    sender: {
      firstName: string;
      image: string;
      _id: string
    };
  }>;
};

interface MessageState {
  messages: Message | null; 
  error: boolean;
  isOnline: boolean;
}

const initialState: MessageState = {
  messages: null,
  error: false,
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
};

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { workSpaceId } = state.workspace;

    if (!workSpaceId) return rejectWithValue("Invalid data");

    try {
      const { data } = await axiosInstance.get(
        `/chat/workspaces/${workSpaceId}/messages`
      );
      return data.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return null;
      }
      return rejectWithValue(err);
    }
  }
);

// export const addMessage = createAsyncThunk(
//   "message/addMessage",
//   async (text: string, { getState, rejectWithValue }) => {
//     const state = getState() as RootState;
//     const { workSpaceId } = state.workspace;
//     if (!workSpaceId) return rejectWithValue("Invalid data");

//     try {
//       await axiosInstance.post(`/chat/workspaces/${workSpaceId}/messages`, {
//         content: text,
//       });
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { workSpaceId } = state.workspace;
    if (!workSpaceId) return rejectWithValue("Invalid data");
    try {
      await axiosInstance.delete(`/chat/workspaces/${workSpaceId}/chat`);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    socketMessage(state, action) {
        state.messages = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload || null;
        state.error = false;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.error = true;
      });
  },
});

export const { setOnlineStatus, socketMessage } = messageSlice.actions;
export default messageSlice.reducer;
