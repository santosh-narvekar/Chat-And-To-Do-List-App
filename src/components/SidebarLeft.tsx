import { useDispatch, useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import { AppDispatch, RootState } from "../Redux/store";
import { setCurrentSelectedChat, setIsChatTab } from "../Redux/chatSlice";
import Chats from "./Chats";
import Users from "./Users";
import { useEffect, useState } from "react";
import { getAllUsers } from "../backend/Queries";
import { defaultUser } from "../Redux/userSlice";

type Props = {}

export default function SidebarLeft({}: Props) {

  const {isChatsTab} = useSelector((state:RootState)=>state.chat);
  const dispatch = useDispatch<AppDispatch>();
  const [usersLoading,setUsersLoading] = useState(false);
  const sidebarOpen = useSelector((state:RootState)=>state.chat.SidebarOpen)
  useEffect(()=>{
     getAllUsers(dispatch,setUsersLoading);
  },[]);

  return (
      <Sidebar className={`flex-[0.8] 
      h-[80%] w-[100%] absolute md:relative z-10 md:z-0
      md:w-full md:h-full  ${ sidebarOpen ?'translate-x-0':'-translate-x-full md:translate-x-0'}
      `}>

        <div className="flex flex-col">
           <div className="flex sticky top-0 z-10">
            <p
            onClick={() => dispatch(setIsChatTab(true))}
            className={`x  p-5 flex-1 text-center font-bold cursor-pointer ${isChatsTab?'bg-gradient-to-r from-myBlue to-myPink text-white':'bg-gray-200 text-gray-900 '}`}>Chats</p>
            <p
            
            onClick={() => {
              dispatch(setIsChatTab(false))
              dispatch(setCurrentSelectedChat(defaultUser));
            }}
            className={`p-5 flex-1 text-center font-bold cursor-pointer ${!isChatsTab?'bg-gradient-to-r from-myBlue to-myPink text-white':'bg-gray-200 text-gray-900'}`}>Users</p>
           </div>
           
           <div className="flex-1 flex flex-col py-2 max-h-full    ">
           {isChatsTab?<Chats />:<Users loading={usersLoading} 
           />}
           </div>
        </div>
      </Sidebar>
  )
}