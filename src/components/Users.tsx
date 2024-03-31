import { useDispatch, useSelector } from "react-redux"
import {  UsersLoader } from "./Loaders"
import { AppDispatch, RootState } from "../Redux/store"
import FlipMove from "react-flip-move";
import UserHeader from "./UserHeader";
import { setAlertOpen } from "../Redux/userSlice";

type UserPropTypes = {
  loading:boolean
}

export default function Users({loading}: UserPropTypes){
  const {users}=useSelector((state:RootState)=>state.user)
  const dispatch = useDispatch<AppDispatch>();

  const handleStartChat =(r_id:string,r_name:string)=>{
    dispatch(setAlertOpen({
      open:true,
      receiverId:r_id,
      receiverName:r_name
    }))
  }

    return loading?<UsersLoader />:users.length===0?(<div className=" p-10 ">No user registered apart from you!</div>):<FlipMove>

    {
      users.map(user=>{
        return <UserHeader
        loading={loading} 
        handleClick={()=>handleStartChat(user.id,user.username)}
        key={user.id} user={user} otherUser />
      })
    }
  </FlipMove>
  
}
