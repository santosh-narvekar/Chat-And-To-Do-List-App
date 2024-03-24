// all firebase functions goes here

import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastError, toastSuccess } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, taskListType, taskType, userType } from "../types";
import { NavigateFunction, useActionData } from "react-router-dom";

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { defaultUser, setUser } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import convertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/avatarGenerator";
import React from "react";
import { addTask, addTaskList, defaultTask, defaultTaskList,deleteTask,deleteTaskList,saveTask,saveTaskListTitle, setTask, setTaskList } from "../Redux/taskSlice";
import { setLogLevel } from "firebase/app";
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
  Loading(false);
 })
}


export const getStorageUser = () => {
  const user = localStorage.getItem('currentUser');
  if(user) return JSON.parse(user)
  else return null
}


// saving userInfo
export const saveInfo=async(dispatch:AppDispatch,data:{
  email:string,
  username:string,
  img:string,
  password:string,
},setLoading:setLoadingType)=>{
  setLoading(true);

  const {email,username,password,img} = data;
  const {id} = getStorageUser();

  /*
  updateProfile(auth.currentUser, {
  displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(() => {
  // Profile updated!
  // ...
}).catch((error) => {
  // An error occurred
  // ...
});

  */
  if(id && auth.currentUser){

    // update email if present
    if(email){

      updateEmail(auth.currentUser,email).then(()=>{

        toastSuccess("Email Updated Successfully");

      }).catch(err=>CatchErr(err));
    }

    // update Password if present
    if(password){
       updatePassword(auth.currentUser,password).then(()=>{

        toastSuccess("Password Updated Successfully");

      }).catch(err=>CatchErr(err));
    }

    // updating user collection
    if(username || img){
      await updateUserInfo({username,img,isOnline:true});
      toastSuccess("Updated Profile Successfully!")
    }

    // get user latest info
    const userInfo = await getUserInfo(id);

    // updare User in state on store
    dispatch(setUser(userInfo));
    setLoading(false)
  }else{
    toastError("BE_saveProfile: Id not found");
    setLoading(false)
  } 

  
}

// delete user account
export const deleteAccount = async(
  dispatch:AppDispatch,
  navigate:NavigateFunction,
  setLoading:setLoadingType
)=>{
  setLoading(true);
  // finally delete user account
  const user = auth.currentUser;
  const userTaskList = await getAllTaskList(); // [{tasks:[]},{tasks:[]}]
  console.log(userTaskList)
  //const user=null;
  if(user){ 
    // delete the user
    deleteUser(user).then(()=>{
      // delete the user info from collection
      if(userTaskList.length>0){
          userTaskList.forEach(async(tl)=>{
          if(tl.id) tl.tasks = await getTasks(tl.id); // [{taskType},{taskType}]
          console.log(tl.tasks)
          if(tl.id && tl.tasks) await Be_deleteTaskList(tl.id,tl.tasks,dispatch)
          })
      }
      deleteDoc(doc(db,usersColl,getStorageUser().id));
      //await BE_signOut(dispatch);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserPage")
      navigate('/auth');
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      CatchErr(err);
      setLoading(false);
    })
  }else{
    setLoading(false)
  }


}

// add User To firebase collection
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

// ======================== TASK LISTS =====================

// add a single task list
export const Be_addTaskList = async(dispatch:AppDispatch,setLoading:setLoadingType)=>{
  setLoading(true);
  const {title} = defaultTaskList;

  // Add a new document with a generated id.
  const list = await addDoc(collection(db, taskListsColl), {
    title,
    userId:getStorageUser().id 
  });

  const newDocSnap = await getDoc(doc(db,list.path));
  
  if(newDocSnap.exists()){
    const newlyAddedDoc:taskListType = {
      id:newDocSnap.id,
      title:newDocSnap.data().title,
    }

    // dispatch
    dispatch(addTaskList(newlyAddedDoc));
    setLoading(false);

  }else{
    toastError("BE_addTaskList:No Such doc");
    setLoading(false);
  }
}

// get all task list
export const Be_getTaskList = async(dispatch:AppDispatch,setLoading:setLoadingType)=>{
  setLoading(true);

  // get task list from firebase
  const taskList = await getAllTaskList();

  dispatch(setTaskList(taskList));
  setLoading(false);

}

export const Be_saveTaskList = async(dispatch:AppDispatch,setLoading:setLoadingType,listId:string,title:string)=>{
  setLoading(true);
  await updateDoc(doc(db,taskListsColl,listId),{title});
  const updatedTaskList = await getDoc(doc(db,taskListsColl,listId))
  setLoading(false);
  // dispatch to save task list
  dispatch(saveTaskListTitle({id:updatedTaskList.id,...updatedTaskList.data()}));
}

export const Be_deleteTaskList = async(listId:string,tasks:taskType[],dispatch:AppDispatch,setLoading?:setLoadingType)=>{
  if(setLoading) setLoading(true)
   

  if(tasks.length > 0){
  for(let i=0;i<tasks.length;i++){
    let {id}=tasks[i];
    if(id) be_deleteTask(listId,id,dispatch)
  }
  }

  await deleteDoc(doc(db,taskListsColl,listId));
 
  if(setLoading) setLoading(false);
  dispatch(deleteTaskList({listId}));
}



// get all users tasklist
const getAllTaskList = async() => {
  const q = query(collection(db, taskListsColl), where("userId", "==", getStorageUser().id));
 
  const taskListSnapshot = await getDocs(q);
  const taskList : taskListType[] = []

  taskListSnapshot.forEach((doc) => {
    const { title } = doc.data();
    
    taskList.push({
      id:doc.id,
      title,
      editMode:false,
      tasks:[]
    });
  });
  return taskList
}

// ======================= TASK ========================

// delete task
export const be_deleteTask = async(listId:string,id:string,dispatch:AppDispatch,setLoading?:setLoadingType) => {
  if(setLoading) setLoading(true);
  
  // getting the task reference
  const taskRef = doc(db,taskListsColl,listId,tasksColl,id);
  await deleteDoc(taskRef);

  const deletedTask = await getDoc(taskRef);

  if(!deletedTask.exists()){
    // successfully deleted it
    if(setLoading) setLoading(false)
    
    // dispatch actions
    dispatch(deleteTask({ listId,id }));
  }else{
    toastError("Something went wrong!")
    if(setLoading) setLoading(false);
  }
}

// add task 
export const be_addTask = async(dispatch:AppDispatch,listId:string,setLoading:setLoadingType)=>{
  setLoading(true);

  const newTask = await addDoc(collection(db,taskListsColl,listId,tasksColl),{
    ...defaultTask
  })

  console.log(newTask.path)
  const newTaskSnapShot = await getDoc(doc(db,newTask.path));

  if(newTaskSnapShot.exists()) {
    const {title,description} = newTaskSnapShot.data();
    
    // update it to store
    const newTask:taskType={
      id:newTaskSnapShot.id,
      title,
      description
    }

    // dispatch to store
    dispatch(addTask({listId,newTask}))
    setLoading(false)
  }else{
    toastError("BE_ERROR: no such document found");
    setLoading(false);
  }
}

// save task
export const be_saveTask = async(dispatch:AppDispatch,id:string,setLoading:setLoadingType,listId:string,title:string,description:string)=>{
  setLoading(true);

  if(id){
    await updateDoc(doc(db,taskListsColl,listId,tasksColl,id),{
      title,
      description
    })
    
  const updatedTask = await getDoc(doc(db,taskListsColl,listId,tasksColl,id));
  if(updatedTask.exists()){
    setLoading(false);
    // dispatch action to save task
    dispatch(saveTask({
      id:updatedTask.id,
      listId,
      ...updatedTask.data()
    }));
  }else{
    toastError("something went wrong");
  }
  }else{
  toastError("BE_ERROR:SOMETHING WENT WRONG");
  setLoading(false);
}
};

// get tasks for task list
export const be_getTask = async(dispatch:AppDispatch,setLoading:setLoadingType,listId:string) => {
  setLoading(true);  
  
  const tasks = await getTasks(listId);
  console.log(tasks);
  
  // dispatch action
  dispatch(setTask({listId,tasks}))
  setLoading(false)
}

const getTasks = async(listId:string)=>{
   const querySnapshot = await getDocs(collection(db,taskListsColl,listId,tasksColl));
   console.log(querySnapshot)
   const tasksList:taskType[]=[]

   querySnapshot.forEach(doc=>{
     const {title,description} = doc.data();

     tasksList.push({
      id:doc.id,
      title,
      description,
      editMode:false,
      collapsed:true
     })
   })
   
  return tasksList
}