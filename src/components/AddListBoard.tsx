import { useState } from "react"
import Button from "./Button"
import Icon from "./Icon"
import {MdAdd} from "react-icons/md"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../Redux/store"
import { Be_addTaskList } from "../backend/Queries"

type Props = {}

export default function AddListBoard({}: Props) {
  const [loading,setAddLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddLoading = () => {
    Be_addTaskList(dispatch,setAddLoading);
  }
  
  return (
    <>
       <Button text="Add New ListBoard"
       className="hidden md:flex"
       loading={loading}
       onClick={handleAddLoading}
        />
       <Icon IconName={MdAdd} 
       loading={loading}
       onClick={handleAddLoading}
       className=" block md:hidden " reduceOpacityOnHover={false}/>
    </>
  )
}