import { useSelector } from "react-redux";
import SidebarLeft from "../components/SidebarLeft";
import { RootState } from "../Redux/store";
import ChatArea from "../components/ChatArea";
import SideBarRight from "../components/SideBarRight";
const nochat = require("../assets/nochat.jpg")

export default function ChatPage(){
  const {currentSelectedChat} = useSelector((state:RootState)=>state.chat);
  return (
    <div
    className="h-full max-w-[1500px] flex 
    justify-center
    md:justify-between m-auto p-3"
    >
      <SidebarLeft />
      { currentSelectedChat?.id ? (
        <>
        <ChatArea/>
        <SideBarRight />
        </>
      ) :  
      <div className="hidden lg:block  flex-[0.7]
      bg-white rounded-r-3xl shadow-md overflow-hidden
      ">
        <img src={nochat} alt="no chat"
        className="w-full h-full object-contain"
        />
      </div>
    }
    </div>
  )
}