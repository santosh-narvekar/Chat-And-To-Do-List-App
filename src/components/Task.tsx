import React, { forwardRef, useState } from 'react'
import Icon from './Icon'
import { MdDelete, MdEdit, MdSave } from 'react-icons/md'
import { taskType } from '../types'
import { useDispatch } from 'react-redux'
import { collapseTask, editTask } from '../Redux/taskSlice'
import { be_deleteTask, be_saveTask } from '../backend/Queries'

type TaskType= {
  task:taskType,
  listId:string
}

export const Task = forwardRef(({task,listId}:TaskType,ref:React.LegacyRef<HTMLDivElement> | undefined)=>{
  const {id,title,description,editMode,collapsed} = task;
  const [homeTitle,setHomeTitle]=useState(title);
  const [homeDescription,setHomeDescription] = useState(description);
  const [saveTaskLoading,setSaveTaskLoading] = useState(false);
  const [deleteTaskLoading,setDeleteTaskLoading] = useState(false);
  const dispatch = useDispatch();

  const collapse = ()=>{
    dispatch(collapseTask({listId,taskId:id}));
  }

  const handleTaskSave=()=>{
    if(id) be_saveTask(dispatch,id,setSaveTaskLoading,listId,homeTitle,homeDescription)
  }

  const handleEdit=()=>{
    dispatch(editTask({listId,taskId:id}))
  }

  const handleTaskDelete=()=>{
   if(id) be_deleteTask(listId,id,dispatch,setDeleteTaskLoading);
  }

  return (
     <div ref={ref} className={`bg-white p-2 mb-2 rounded-md drop-shadow-sm hover:drop-shadow-md`}>
      <div>
        {
          editMode?
          <input
          value={homeTitle}
          onChange={(e)=>setHomeTitle(e.target.value)}
          className='border-2 px-2  border-myBlue rounded-sm mb-1'
          placeholder='Task title'
          />
          :
      <p className="cursor-pointer" onClick = {collapse}>{title}</p>
        }
      </div>
      
      {
          !collapsed &&
      <div>
        <hr/>
          <div>
            {editMode?<textarea 
            value={homeDescription}
            placeholder='Todo Description'
            className='w-full px-3 border-2 border-myBlue rounded-md mt-2'
            onChange={(e)=>setHomeDescription(e.target.value)}/>:<p className='p-2 text-justify'>{description}</p>
            }
          <div className="flex justify-end">
            <Icon 
            size={16}
            IconName={editMode?MdSave:MdEdit}
            onClick={editMode?handleTaskSave:handleEdit}
            loading={editMode && saveTaskLoading}
            />
            <Icon 
            size={16}
            IconName={MdDelete} 
            loading={deleteTaskLoading}
            onClick={handleTaskDelete}
            />
          </div>
        </div>     
      </div>
    }
    </div>
  
  )
})