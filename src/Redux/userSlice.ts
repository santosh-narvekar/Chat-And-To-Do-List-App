import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../types";

export const defaultUser:userType={
  id:"",
  username:"",
  email:"",
  isOnline:false,
  img:"",
  bio:"",
  creationTime:"",
  lastSeen:"",
}


type userStateType = {
  users:userType[],
  currentUser:userType,
  alertProps:{
    open:boolean,
    receiverId:string,
    receiverName:string
  }
}

const initialState:userStateType = {
  users:[],
  currentUser:defaultUser,
  alertProps:{
    open:false,
    receiverId:"",
    receiverName:""
  }
  // currentSelectedUser:null
}


const userSlice = createSlice({
   name:'user',
   initialState,
   reducers:{
    setUser:(state,action) => {
      const user = action.payload
      console.log(user);
      console.log(action.payload)
      // store user in localstorage
      localStorage.setItem('currentUser',JSON.stringify(user));
      // currently logged In Users
      state.currentUser = user;
    },
    setUsers:(state,action)=>{
      // all Current Users in Database
      state.users = action.payload
    },
    setAlertOpen:(state,action)=>{
      const  {open,receiverId,receiverName} = action.payload;
      console.log(action.payload)
      state.alertProps = {
        open,
        receiverId:receiverId || '',
        receiverName:receiverName || ''
      }
    }
   }
})

export const {setUser,setUsers,setAlertOpen} = userSlice.actions;
export default userSlice.reducer