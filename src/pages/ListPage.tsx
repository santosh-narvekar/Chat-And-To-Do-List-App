import { useEffect, useState } from "react"
import {SingleTaskList} from "../components/SingleTaskList"
import { Be_getTaskList } from "../backend/Queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { ListLoaders } from "../components/Loaders";
import FlipMove from "react-flip-move";

type Props = {}

export default function ListPage({}: Props) {
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch<AppDispatch>();
  const {currentTaskList} = useSelector((state:RootState)=>state.taskList)

  useEffect(()=>{

    // calling hen list page mounts
    Be_getTaskList(dispatch,setLoading);

  },[dispatch]);

  return (
    <div className="p-16">

      {loading?<ListLoaders  />:currentTaskList.length===0?

      <h1 className="text-3xl text-center text-gray-500 mt-10 ">No tasks list added , add some!</h1>

      :<FlipMove className="flex flex-wrap justify-center gap-10">
      {
        currentTaskList.map((t)=>{
          return <SingleTaskList key={t.id} singleTaskList={t} />
        })
      }
    </FlipMove>
      }
    </div>
  )
}