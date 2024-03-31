import { useSelector } from "react-redux"
import { UserLoader } from "./Loaders"
import { RootState } from "../Redux/store"
import ChatsProfile from "./ChatsProfile"
import { chatType } from "../types"
import { get } from "http"
import {  iCreatedChat } from "../backend/Queries"

export default function Chats(){
  const {chats}=useSelector((state:RootState)=>state.chat)
  
  // we will independently each load each chat
  return (
    chats.length==0?(<div className=" p-10  ">No chat yet for you, Choose a user and start chatting!</div>):
    (
      chats.map((chat)=>{
        return <ChatsProfile key={chat.id} userId={iCreatedChat(chat.senderId)?chat.receiverId:chat.senderId} chat={chat} />
      })
    )
  )
}