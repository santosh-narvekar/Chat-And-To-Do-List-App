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

const initialState = {
  // users:[],
   currentUser:defaultUser,
  // currentSelectedUser:null
}

const userSlice = createSlice({
   name:'user',
   initialState,
   reducers:{
    setUser:(state,action)=>{
      const user = action.payload
      // store user in localstorage
      localStorage.setItem('currentUser',JSON.stringify(user));
      // currently logged In Users
      state.currentUser = user;
    },
    setUsers:(state,action)=>{
      // all Current Users in Database

    }
   }
})

export const {setUser,setUsers} = userSlice.actions;
export default userSlice.reducer