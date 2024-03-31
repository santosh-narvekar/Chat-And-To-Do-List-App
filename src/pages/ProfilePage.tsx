import { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { AppDispatch, RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/userSlice";
import AvatarGenerator from "../utils/avatarGenerator";
import { deleteAccount, getStorageUser, saveInfo } from "../backend/Queries";
import { toastError, toastWarn } from "../utils/toast";
import { useNavigate } from "react-router-dom";


export default function ProfilePage(){

  // creating 5 state variables
  const currentUser = useSelector((state:RootState)=>state.user.currentUser);
  const user = getStorageUser()
  const [email,setEmail] = useState(user?.email);
  const [username,setUsername] = useState(user?.username); 
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [avatar,setAvatar]=useState('');
  const [saveProfileLoading,setSaveProfileLoading]=useState(false);
  const [deleteProfileLoading,setDeleteProfileLoading]=useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  

  const generateAvatar=()=>{
   setAvatar(AvatarGenerator())
  }

  // save Profile
  const handleSaveProfile = async()=>{
    // Make sure email and username aren't empty
    if(!email || !username) toastError("Email or username can't be empty!")

    // if there's a password , make sure it's equal to confirmPassword
    let temp_password = password
    if(temp_password){
    
      if(temp_password!==confirmPassword) {
        toastError("password and confirmPassword aren't same!");

        temp_password=""
      }
    }

    // only update the email if it was changed
    let temp_email = email;
    if(temp_email===currentUser.email) temp_email=""

    // only update the username if it was changed
    let temp_username = username;
    if(temp_username === currentUser.username)temp_username=""

    // only update the avatar if it was changed
    let temp_avatar = avatar;
    if(temp_avatar===currentUser.img) temp_avatar=""

    if(temp_email || temp_username || temp_avatar || temp_password){
      // if anybody is updated we want to update profile

      await saveInfo(dispatch,{
        email:temp_email,
        username:temp_username,
        img:temp_avatar,
        password:temp_password
      },setSaveProfileLoading)
    }else toastWarn("Change details before saving!")

  }

  // delete acc
  const handleDeleteAcc = async() => {
    if(window.confirm(`Are you sure you want to delete 
    ${username}? This can't be reversed
    `)){
      deleteAccount(dispatch,navigate,setDeleteProfileLoading)
    }
  }
  return (
    <div className="bg-white flex flex-col gap-5 shadow-md max-w-2xl rounded-xl py-5 px-6 md:p-10 md:m-auto m-5 md:mt-10">
     <div className="relative self-center"
     onClick={generateAvatar}
     >
        <img
        src={avatar || currentUser?.img} alt={currentUser?.username} className="w-32 h-32 md:w-48 md:h-48 rounded-full p-[2px] 
        ring-2 ring-gray-300 cursor-pointer hover:shadow-lg
        " />
        <span className='absolute top-7 md:top-7
        left-28 md:left-40 w-5 h-5 border-2 border-gray-800
        rounded-full bg-green-400
        ' 
        ></span>
     </div> 
     <p className="text-gray-400 text-sm text-center">
      Note:Click on image to temporary change it , when you like it, then save profile.You can leave password and username as they are if you don't want to change them
     </p>

     <div className="flex flex-col gap-2">
      <Input  name="email" value={email} onChange={(e)=>setEmail(e.target.value)}  />
      <Input name="username"  value={username} onChange={(e)=>setUsername(e.target.value)}  />
      <Input
      type="password"
      name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <Input 
      type="password"
      name="confirmPassword" value={confirmPassword}  onChange={(e)=>setConfirmPassword(e.target.value)}  />
      <Button 
      loading={saveProfileLoading}
      text="Update Profile" onClick={handleSaveProfile}/>
      <Button text="Delete Account"
      onClick = {handleDeleteAcc}
      secondary
      loading={deleteProfileLoading}
      />
     </div>
    </div>
  )
}

