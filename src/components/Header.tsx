import AddListBoard from "./AddListBoard"
import Button from "./Button"
import Icon from "./Icon"
import {BsFillChatFill} from "react-icons/bs"
import {FiList} from "react-icons/fi"
import UserHeader from "./UserHeader"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../Redux/store"
import { Link, useNavigate } from "react-router-dom"
import { BE_signOut, getChats, getStorageUser } from "../backend/Queries"
import Spinner from "./Spinner"
import { defaultUser, setUser } from "../Redux/userSlice"

const logo = require('../assets/logo.png')
type Props = {}

export default function Header({}: Props) {
  const [logoutLoading,setLogoutLoading] = useState(false);
  const navigate = useNavigate()

  // subscribing our state with ui
  const {currentUser} = useSelector((state:RootState) => state.user)
  const {hasNewMessage}=useSelector((state:RootState)=>state.chat)
  //const currentUser = getStorageUser()
  const dispatch = useDispatch();
  const user = getStorageUser()



  useEffect(()=>{
    if(!user?.id) navigate('/auth')
    const page = getCurrentPage();

    if(user?.id){
      dispatch(setUser(user))
      navigate(`/dashboard/${page}`)
    }else{
      dispatch(setUser(defaultUser))
      navigate('/auth');
    }

    // getChats
    const get = async()=>{
      await getChats(dispatch);
    }

    get()
  },[navigate]);

  const handleGoToPage = (page:string)=>{
    navigate(`/dashboard/${page}`)
    setCurrentPage(page);
  }

  const handleSignOut=()=>{
    // signing out in firebase
    BE_signOut(dispatch,navigate,setLogoutLoading);
  }

  const setCurrentPage = (page:string)=>{
    localStorage.setItem("currentUserPage",page);
  }

  
  const getCurrentPage = ()=>{
     return localStorage.getItem("currentUserPage");
  }



  return (

    <div className="drop-shadow-md bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white
      flex flex-wrap sm:flex-row gap-5 items-center justify-between z-50">
      <img className="w-[70px] drop-shadow-md" src={logo} alt="logo" />
      <div className="flex flex-row-reverse md:flex-row items-center justify-center gap-5 flex-wrap">
        
        {
         getCurrentPage() === "" && <AddListBoard />  
        }
          
        
        {
          getCurrentPage() !== 'chat' && <Icon IconName={BsFillChatFill} ping={hasNewMessage} onClick = {() => handleGoToPage("chat") }  
          reduceOpacityOnHover={false} />
        }

        {
          getCurrentPage()==='chat' || getCurrentPage()==="profile"?<Icon IconName={FiList} onClick={() => handleGoToPage("")}
          reduceOpacityOnHover={false} /> : null
        } 

        <div className = " group relative ">
        <UserHeader user={currentUser}/>
        <div className="absolute pt-5 hidden group-hover:block w-full min-w-max ">
          <ul className="w-full bg-white overflow-hidden rounded-md shadow-md text-gray-700 pt-1 z-10 ">
           <p onClick={() => handleGoToPage("profile") } 
           className="hover:bg-gray-200 py-2 px-4 block cursor-pointer">Profile</p>
           <button
           onClick={()=>!logoutLoading && handleSignOut()}
           className="hover:bg-gray-200 py-2 px-4  hover:cursor-pointer flex items-center gap-4 w-full" >Logout
           {logoutLoading && <Spinner/>}
           </button>
          
          </ul>
        </div>
        </div>
      </div>
    </div>
  )
}