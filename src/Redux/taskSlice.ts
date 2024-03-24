import { createSlice } from "@reduxjs/toolkit";
import { taskListType, taskType } from "../types";

export const defaultTaskList:taskListType = {
  title:"Sample Task List"
}


export const defaultTask:taskType = {
  title:"I'll shall do this at 9:00 am",
  description:"This is what I'll need to do in order to finish this"
}

type TaskListSliceType = {
  // currentTaskList is a array of many TaskLists
  currentTaskList : taskListType[]
  
}

const initialState:TaskListSliceType={
  currentTaskList:[],
  
}

const taskListSlice = createSlice({
  name:'taskList',
  initialState,
  reducers:{
    setTaskList:(state,action) => {
      state.currentTaskList = action.payload;
    },
    addTaskList:(state,action) => {
      const newTaskList = action.payload;
      newTaskList.editMode = true;
      newTaskList.tasks = [];
      state.currentTaskList.push(newTaskList);
    },
    saveTaskListTitle:(state,action)=>{
      const {id,title}=action.payload;

      state.currentTaskList.map(t=>{
        if(t.id==id){
          t.title=title
          t.editMode=false
        }
      });
    },
    editTaskListTitle:(state,action)=>{
      console.log(action)
      const {id,value} = action.payload;
      console.log(id)
      state.currentTaskList.map(t=>{
        if(t.id==id){
          t.editMode=!value
        }
      })
    },
    deleteTaskList:(state,action)=>{
      const {listId}=action.payload;
      state.currentTaskList = state.currentTaskList.filter(tl=>tl.id !== listId);
    },
    addTask:(state,action) => {
      const {listId,newTask} = action.payload
      state.currentTaskList.map((t)=>{

        if(t.id === listId){
          t.editMode = false
        
          t.tasks?.map((t)=>{
            t.editMode=false
            t.collapsed=true
          });

          t.tasks?.push({
            ...newTask,
            editMode:true,
            collapsed:false
          });
        }
      })
    },
    collapseTask:(state,action)=>{
      const {listId,taskId} = action.payload;
      const taskList = state.currentTaskList.find(tl=>tl.id === listId);
      const task = taskList?.tasks?.find((t)=>t.id===taskId);
      if(task) task.collapsed=!task?.collapsed;
    },
    collapseAllTask:(state,action)=>{
     // lets get the listId
     const {listId,value}=action.payload;
     const taskList = state.currentTaskList.find(tl=>tl.id === listId);
     taskList?.tasks?.map(t=>{
      t.editMode=false;
      t.collapsed = value === true?true:false
     })
    },
    saveTask:(state,action) => {
      const {id,title,description,listId} = action.payload;
      const taskList = state.currentTaskList.find(tl=>tl.id === listId);
      const task = taskList?.tasks?.find(t=>t.id===id);
     
      if(task){
        task.id=id;
        task.title=title;
        task.description=description;
      //  task.collapsed=true;
        task.editMode=false
      }
    },
    editTask:(state,action) => {
      const {listId,taskId} = action.payload;
      const taskList = state.currentTaskList.find(tl=>tl.id==listId);
      const task = taskList?.tasks?.find(t=>t.id===taskId);
      if(task) task.editMode=true
    },
    setTask:(state,action)=>{
      const {listId,tasks} = action.payload;
      const taskList = state.currentTaskList.find((t)=>t.id === listId);
      tasks.map((task:taskType)=>{
        taskList?.tasks?.push(task);
      })
    },
    deleteTask:(state,action)=>{
      const {listId,id} = action.payload;
      let taskList = state.currentTaskList.find(tl => tl.id === listId);
      let task = taskList?.tasks?.find(t => t.id === id);
      if(task) taskList?.tasks?.splice(taskList?.tasks?.indexOf(task),1)
    }
  }
})

export const {setTaskList,addTaskList,saveTaskListTitle,editTaskListTitle,deleteTaskList,addTask,collapseTask,collapseAllTask,saveTask,editTask,setTask,deleteTask}=taskListSlice.actions;
export default taskListSlice.reducer;