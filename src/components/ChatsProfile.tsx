import { useEffect, useState } from "react"
import { chatType, userType } from "../types"
import { getUserInfo, iCreatedChat } from "../backend/Queries"
import { toastError } from "../utils/toast";
import UserHeader from "./UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { setCurrentSelectedChat, setSidebarOpen } from "../Redux/chatSlice";

type ChatProfileTypes = {
  userId?:string,
  chat:chatType,
}

export default function ChatsProfile({userId,chat}: ChatProfileTypes){

  const [userLoading,setUserLoading]=useState(false);
  const [user,setUser] = useState<userType>();
  const dispatch = useDispatch<AppDispatch>();
  const {id:chatId,senderId,lastMsg,receiverToSenderNewMsgCount,senderToReceiverNewMsgCount}=chat;
  const {currentSelectedChat}=useSelector((state:RootState)=>state.chat)
  
  useEffect(()=>{
    const getUser = async()=>{
     if(userId) {
      let curUser = await getUserInfo(userId,setUserLoading)
      setUser(curUser)
     } else toastError("ChatsProfile: user not found!")
    }
    getUser()

  },[userId])

  const handleSelectedChat = () => {
    dispatch(setCurrentSelectedChat({
      ...user,
      chatId,
      receiverToSenderNewMsgCount,
      senderToReceiverNewMsgCount
    }));
    // close sidebar
    dispatch(setSidebarOpen())
  }

  return (
      <UserHeader
      newMsgCount={iCreatedChat(senderId)?receiverToSenderNewMsgCount:senderToReceiverNewMsgCount}
      handleClick={handleSelectedChat}
      user={user} otherUser lastMsg={lastMsg || 'last message...'} loading={userLoading} 
      isSelected = {userId === currentSelectedChat.id}
      />
  )
}