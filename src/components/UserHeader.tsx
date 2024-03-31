import React, { forwardRef } from 'react'
import { userType } from '../types'
import { UserLoader } from './Loaders';
import Truncate from '../utils/truncateText';

type Props = {
  user?:userType;
  handleClick?:() => void;
  otherUser?:boolean;
  lastMsg?:string;
  loading?:boolean;
  newMsgCount?:number;
  isSelected?:boolean;
}

const UserHeader = forwardRef(({user,handleClick,otherUser,lastMsg,loading,newMsgCount,isSelected}:Props,ref:React.LegacyRef<HTMLDivElement> | undefined)=>{
  return (
   loading && otherUser ? <UserLoader />
   :<div 
      ref={ref}
    onClick={handleClick} className={`flex 
    items-center space-x-4 cursor-pointer ${otherUser && 'group px-5 py-3 border-b-[1px] hover:bg-gray-200 border-gray-200'}
    ${isSelected && 'bg-gray-200'}
    `}>
       <div className='relative' >
          <img src={user?.img || ''} alt='user profile' className ={`w-11 h-11 hover:shadow-lg rounded-full ring-2  p-[2px] ${otherUser?'ring-gray-300 group-hover:ring-gray-400':'ring-white'}
          ${isSelected && 'ring-gray-400'}
          `} />
          <span className={`absolute -top-1 left-7 w-4 h-4 border-2 border-gray-800  rounded-full
          ${user?.isOnline ? 'bg-green-400':'bg-gray-400'}
          `}></span>
       </div>
       <div className = {`${!otherUser && 'hidden md:block'} block
       `} >
          <div className={`-mb-1 flex items-center gap-2 ${otherUser && 'text-gray-600 group-hover:text-gray-900'}
          ${isSelected && 'text-gray-900'}
          `}>
            {user?.username || 'defaultUser'}
            {newMsgCount && newMsgCount>0?(<p className='bg-myPink w-auto min-w-[28px] h-7 p-2 rounded-full flex items-center justify-center text-white'>
              {newMsgCount}      
            </p>):""}
          </div>
          <div className={`text-sm text-gray-300 ${otherUser && 'text-gray-400 group-hover:text-gray-500'}
          ${isSelected && 'text-gray-500'}
          `}>
            {
              !otherUser?`Joined In: ${user?.creationTime}`:otherUser && !lastMsg ? `Last Seen: ${user?.lastSeen}`:`${lastMsg && Truncate(lastMsg)}`
            }
           </div>
       </div>
    </div>
  )
})
export default UserHeader