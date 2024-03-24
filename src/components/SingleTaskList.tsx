import { MdAdd, MdDelete, MdEdit, MdKeyboardArrowDown, MdKeyboardArrowUp, MdSave } from "react-icons/md"
import Icon from "./Icon"
import Tasks from "./Tasks"
import { taskListType } from "../types"
import { forwardRef, useEffect, useState } from "react"
import { Be_deleteTaskList, Be_saveTaskList, be_addTask, be_getTask } from "../backend/Queries"
import { useDispatch } from "react-redux"
import {   collapseAllTask, editTaskListTitle } from "../Redux/taskSlice"
import { AppDispatch } from "../Redux/store"
import { TaskListTasksLoader } from "./Loaders"

type Props = {
  singleTaskList:taskListType
}

export const SingleTaskList = forwardRef(({singleTaskList}: Props,ref:React.LegacyRef<HTMLDivElement>| undefined)=>{

  const {id,title,editMode,tasks=[]} = singleTaskList;
  const [homeTitle,setHomeTitle] = useState(title);
  const dispatch = useDispatch<AppDispatch>();
  const [saveLoading,setSaveLoading] = useState(false);
  const [deleteLoading,setDeleteLoading] = useState(false);
  const [addTaskLoading,setAddTaskLoading] = useState(false);
  const [tasksloading,setTasksLoading] = useState(false);
  const [allCollapsed,setAllCollapsed] = useState(false);
  

  useEffect(()=>{
    // get tasks here
    if(id) be_getTask(dispatch,setTasksLoading,id);
  },[dispatch,id]);

  useEffect(()=>{
    for(let i=0;i<tasks?.length;i++){
      let task = tasks[i];
      if(!task?.collapsed) return setAllCollapsed(false)
    } 
  return setAllCollapsed(true)
  },[tasks])

  const handleSaveTaskListTitle=()=>{
    // save the information with the updated title in db
    if(id) Be_saveTaskList(dispatch,setSaveLoading,id,homeTitle)
  }

  const handleEditMode = () => {
     dispatch(editTaskListTitle({id,value:false}));
  }

  const handleDeleteTaskList = ()=>{
   if(id && tasks) Be_deleteTaskList(id,tasks,dispatch,setDeleteLoading);
  }

  const AddTask=()=>{
    if(id) be_addTask(dispatch,id,setAddTaskLoading); 
  }

  const checkEnterKey = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key==="Enter") handleSaveTaskListTitle()
  }
 
  const handleAllCollapse=()=>{
    if(allCollapsed){
      setAllCollapsed(false)
      dispatch(collapseAllTask({listId:id,value:false}));
    }else{
      setAllCollapsed(true);
      dispatch(collapseAllTask({listId:id,value:true}))
    }
  }

  return (
    <div ref={ref} className="relative">
  <div className="bg-[#d3f0f9] w-full md:w-[400px] drop-shadow-md rounded-md  min-h-[150px] overflow-hidden">
      <div className="flex flex-wrap justify-center  md:gap-10 bg-gradient-to-tr from-myBlue to-myPink bg-opacity-70
      p-3 text-white">
        {
          editMode?<input
          onKeyDown={(e)=>checkEnterKey(e)}
          placeholder="Enter task list title"
          value={homeTitle}
          onChange={(e)=>setHomeTitle(e.target.value)}
          className="flex-1 bg-transparent placeholder-gray-300 px-3 py-1
          border-[1px] border-white rounded-md
          "/>:<p className=" flex-1 text-left md:text-center">{title}</p>
        }
        <div>
          
          <Icon IconName={editMode?MdSave:MdEdit} 
          onClick={() => editMode?handleSaveTaskListTitle():handleEditMode() }
          loading={editMode && saveLoading}
          />
          <Icon IconName={MdDelete} onClick={() => handleDeleteTaskList()} loading = {deleteLoading} />
          <Icon 
          onClick={handleAllCollapse}
          IconName={MdKeyboardArrowDown} 
          className={`${allCollapsed?'rotate-180':'rotate-0'} transition-all`}
          />
        </div>
      </div>

      {
        tasksloading ?
        <TaskListTasksLoader />
        : id && <Tasks tasks = {tasks || []} listId={id} />
      }
      
      </div>

      <Icon IconName={MdAdd} 
      onClick={AddTask}
      reduceOpacityOnHover={false}
      className="absolute -top-4 -left-4 p-3 drop-shadow-lg "
      loading={addTaskLoading}
      />
    </div>
  )
})
