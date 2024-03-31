import Button from "./Button"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { setAlertOpen } from "../Redux/userSlice";
import { startChat } from "../backend/Queries";
import { useState } from "react";

export default function Alert() {
  const {open,receiverName,receiverId} = useSelector((state:RootState)=>state.user.alertProps);
  const [chatLoading,setChatLoading]=useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleStartChatting = ()=>{
    // start chatting
    if(receiverId && receiverName){
      startChat(dispatch,receiverId,receiverName,setChatLoading);
    }
  }

  return (
    <div className = {`fixed top-0 z-50 w-full h-full ${open?'flex':'hidden'} justify-center items-center`}>
      <div className = "flex flex-col min-w-[90%] md:min-w-[500px] bg-white border-8 rounded-[30px] p-10 z-30">
        <div className=" flex flex-1 mb-5 "> 
        Start chatting with {receiverName} ?
        </div>
        <div className="flex justify-end gap-5"> 
          <Button text='Cancel' secondary 
          onClick={()=>dispatch(setAlertOpen({open:false}))}
          />
          <Button text="Sure" loading={chatLoading}
          onClick={handleStartChatting}
          />
        </div>
      </div>
      <div className="w-full h-full absolute z-20 backdrop-blur-[2px] bg-black bg-opacity-30"
      onClick={()=>dispatch(setAlertOpen({open:false}))}
      ></div>
      </div>
  )
}