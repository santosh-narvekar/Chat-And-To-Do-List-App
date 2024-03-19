// all firebase functions goes here
// needs to be fixed

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastError, toastSuccess } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, userType } from "../types";
import { NavigateFunction, useActionData } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { defaultUser, setUser } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import convertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/avatarGenerator";
import React from "react";
// collection names
const usersColl = "users";
const tasksColl = "tasks";
const taskListsColl = "taskList";
const ChatsColl = "chats"
const messagesColl = "messages" 

// user Signup
export const signUp = (data:authDataType,
  setLoading:setLoadingType,
  reset:()=> void,
  navigate:NavigateFunction,
  dispatch:AppDispatch
  ) => {
  const {email,password,confirmPassword} = data
  // HANDLING ERRORS
  setLoading(true);
  if(email && password){
    if(password === confirmPassword){
      createUserWithEmailAndPassword(auth,email,password).then(async({user}) => {
        toastSuccess('user registered Successfully!')
      
        const imgLink = AvatarGenerator(user.email?.split('@')[0]);
  
        const userInfo = await addUserToCollection(user.uid,user.email || "",user.email?.split("@")[0] || "",imgLink)
        
        dispatch(setUser(userInfo));
        setLoading(false);
        reset()

        localStorage.setItem('currentUserPage','');
        navigate('/dashboard')
      }).catch((err) => {
        CatchErr(err)
        setLoading(false);
      });
    }else toastError('passwords must match!',setLoading)
  }
  else toastError('Field\'s shoudn\'t  be left empty!',setLoading)
  
}

// user Login
export const signIn = (data:
  authDataType,
  setLoading:setLoadingType,
  reset:() => void,
  navigate:NavigateFunction,
  dispatch:AppDispatch
)=>{
     const {email,password} = data;
     setLoading(true)
     signInWithEmailAndPassword(auth,email,password).then(async({user}) => {

    // first updating
    await updateUserInfo({id:user.uid,isOnline:true})

    // getuserinfo
    const userInfo = await getUserInfo(user.uid);
    dispatch(setUser(userInfo));

    toastSuccess('user logged In Succcessfully');
    setLoading(false)
    reset();

    
    localStorage.setItem('currentUserPage','');
    // route the user to dashboard
    navigate('/dashboard');

  }).catch((err)=>{
    CatchErr(err);
    console.log(err)
    setLoading(false); 
  })
}

export const BE_signOut = async(dispatch:AppDispatch,navigate:NavigateFunction,Loading:React.Dispatch<React.SetStateAction<boolean>>) => {
  // log out from firebase
 Loading(true);
 signOut(auth).then(async()=>{
  // sign out successful
  // updating user info
  await updateUserInfo({isOnline:false});
  
  // set currentSelectedUser to empty
  dispatch(setUser(defaultUser));
  
  // delete the user from ls
  localStorage.removeItem("currentUser")
  localStorage.removeItem("currentUserPage")
   // route to auth page
   navigate('/auth')
   
   Loading(false);
   
 }).catch((err)=>{
  toastError(err);
 })
}


export const getStorageUser = () => {
  const user = localStorage.getItem('currentUser');
  if(user) return JSON.parse(user)
  else return null
  }


// add User To firbase collection
const addUserToCollection = async(id:string,email:string,username:string,img:string)=>{
  await setDoc(doc(db,usersColl,id) , {
    isOnline:true,
    img,
    username,
    email,
    creationTime:serverTimestamp(),
    lastSeen:serverTimestamp(),
    bio:`hi my name is ${username}`
  });

  // return userinfo
  return  await getUserInfo(id)
}

// get user Information
const getUserInfo = async(id:string):Promise<userType> => {
  const userRef = doc(db,usersColl,id);
  const user = await getDoc(userRef);

  if(user.exists()){
    const {img,isOnline,username,email,bio,creationTime,lastSeen} = user.data();

    return {
      id:user.id,
      img,
      isOnline,
      username,
      email,
      bio,
      creationTime:creationTime ? convertTime(creationTime.toDate()):'no date yet! userInfo ',
      lastSeen:lastSeen ? convertTime(lastSeen.toDate()):'no date yet! userInfo '
    }
  }else{
    toastError('user not found!')
    // return default user
    return defaultUser
  }
}

// updating userInfo on signIn
const updateUserInfo = async({id,username,img,isOnline}:{
id?:string,
username?:string,
img?:string,
isOnline?:boolean
})=>{
  if(!id){
    id = getStorageUser().id;
  } 

  if(id){
  // updating userdoc
  await updateDoc(doc(db, usersColl,id),{
  ...(username && {username}),
  ...(isOnline?{isOnline}:{isOnline:false}),
  ...(img && {img}),

  // updating lastseen of user
  lastSeen:serverTimestamp()
  });

  }
}