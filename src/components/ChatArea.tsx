import  { useEffect, useRef, useState } from 'react'
import Input from './Input'
import Icon from './Icon'
import { BsFillCameraFill, BsFillEmojiSunglassesFill, BsFillPeopleFill, BsFillSendFill } from 'react-icons/bs'
import {ImAttachment} from 'react-icons/im'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../Redux/store'
import { setSidebarOpen } from '../Redux/chatSlice'
import { getMsgs, getStorageUser, sendMsgs } from '../backend/Queries'
import { MessageLoader } from './Loaders'
import FlipMove from 'react-flip-move'
import {  toastInfo } from '../utils/toast'

export default function ChatArea() {
  const [msg,setMsg]=useState("");
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const [getMsgloading,setGetMsgLoading]=useState(true);
  const [createMsgLoading, setcreateMsgLoading] = useState(false)
  const {currentSelectedChat,currentMessages}=useSelector((state:RootState)=>state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const chatId=currentSelectedChat.chatId
  useEffect(()=>{

    const get = async()=>{
      if(chatId) await getMsgs(dispatch,chatId,setGetMsgLoading)
    }
    get()
  },[currentSelectedChat.id]);

  const handleSendMsg = async() => {
    // 1. Check if the msg is present
    if(msg.trim()){
      const data={
        senderId:getStorageUser().id,
        content:msg
      }

      setMsg("")
      if(chatId) await sendMsgs(chatId,data,setcreateMsgLoading);
      if(bottomContainerRef) bottomContainerRef.current?.scrollIntoView({behavior:"smooth"})
    }else toastInfo("please enter some text message!")
  }


  const checkEnter=(e:any)=>{
    if(e.key === 'Enter') handleSendMsg();
  }

  return (
    <div className='flex-1 lg:flex-[0.4] max-h-full max-w-full w-screen flex flex-col px-2 md:px-5 gap-2  '>

      {getMsgloading?<MessageLoader/> : 
      <div className='flex flex-col flex-1 
      max-h-screen overflow-y-scroll shadow-inner gap-2 
      '>
       <FlipMove className='flex-1 flex flex-col gap-5'>
        {
          currentMessages.map((msg)=>{
            if(msg.senderId===getStorageUser().id){
              return <div key={msg.id} className='self-end px-10 py-3 max-w-md bg-gradient-to-r from-myBlue to-myPink text-white rounded-br-full rounded-t-full  border-2 border-white'>
           {msg.content}
        </div>
            }else{
              return <div key={msg.id}
               className='self-start px-10 py-3 max-w-md bg-gray-300 text-black rounded-bl-full rounded-t-full  border-2 border-white'>
          {msg.content}
        </div>
            }
            
          })
        }
       </FlipMove>
       <div
       ref={bottomContainerRef}
       className='pb-36 flex  '>
        </div>
      </div>

      }



      <div className='flex gap-1 md:gap-5'>
         <div className='bg-white rounded-full p-[2px] shadow-md flex flex-1 items-center gap-2 border-2 border-e-gray-300'>
          <Icon IconName={BsFillPeopleFill} 
          className='text-gray-500 block md:hidden'
          reduceOpacityOnHover={false}
          size={15}
          onClick={()=>dispatch(setSidebarOpen())}
          />
          <Icon IconName={BsFillEmojiSunglassesFill}
          className='text-gray-500 hidden md:block'
          />
          <Input value={msg} onChange={e=>setMsg(e.target.value)}
          name={`message to ${currentSelectedChat.username}`}
          className='border-none outline-none text-sm md:text-[15px]'
          disabled={createMsgLoading}
          onKeyDown={checkEnter}
          />
          
          <Icon IconName={ImAttachment} 
          className='text-gray-500 hidden md:block rotate-90 '
          />
          
          <Icon IconName={BsFillCameraFill} 
          className='text-gray-500 hidden md:block'
          />
          
         </div>

        <div className="flex items-center justify-center">
          <Icon IconName={BsFillSendFill} 
          reduceOpacityOnHover={false}
          onClick={handleSendMsg}
          loading={createMsgLoading}
          />
        </div>
      </div>
    </div>
  )
}