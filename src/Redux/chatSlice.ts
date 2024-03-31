import { createSlice } from "@reduxjs/toolkit";
import { chatType, message, userType } from "../types";
import { defaultUser } from "./userSlice";
import { iCreatedChat } from "../backend/Queries";

type chatTypes = {
  chats:chatType[];
  isChatsTab:boolean;
  currentSelectedChat:userType &{
    chatId?:string;
    senderToReceiverNewMsgCount?:number;
    receiverToSenderNewMsgCount?:number
  };
  SidebarOpen:boolean;
  currentMessages:message[];
  hasNewMessage:boolean;
}

const initialState:chatTypes={
  chats:[],
  isChatsTab:false,
  currentSelectedChat:defaultUser,
  SidebarOpen:true,
  currentMessages:[],
  hasNewMessage:false
}

const chatSlice  = createSlice({
  name:"chat",
  initialState,
  reducers:{
    setIsChatTab:(state,action:{payload:boolean})=>{
      state.isChatsTab = action.payload
    },
    setChats:(state,action:{payload:chatType[]})=>{
      const chats = action.payload;

      const newMsgCount = chats.reduce((acc,c)=>{
        if(iCreatedChat(c.senderId)){
        return acc + (c.receiverToSenderNewMsgCount || 0)
        }else{
          return acc+(c.senderToReceiverNewMsgCount || 0)
        }
      },0);

      state.hasNewMessage = newMsgCount > 0
      state.chats = chats
    },
    setCurrentSelectedChat:(state,action)=>{
      state.currentSelectedChat = action.payload;
    },
    setSidebarOpen:(state)=>{
      state.SidebarOpen = !state.SidebarOpen
    },
    setCurrentMessages:(state,action)=>{
      state.currentMessages = action.payload;
    }
  }
})

export const {setIsChatTab,setChats,setCurrentSelectedChat,setSidebarOpen,setCurrentMessages}=chatSlice.actions;
export default chatSlice.reducer