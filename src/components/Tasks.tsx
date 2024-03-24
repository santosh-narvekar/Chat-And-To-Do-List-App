import FlipMove from "react-flip-move"
import { taskType } from "../types"
import {Task} from "./Task"

type TasksType = {
  tasks:taskType[],
  listId:string
}

export default function Tasks({listId,tasks}: TasksType) {
  return (
    <div className="p-3 pb-5">
      <FlipMove>
        {
          tasks.map(t => <Task key={t.id} task={t} listId={listId} />)
        }
      </FlipMove>  
      {
        tasks.length===0 && <p className="text-center">No tasks added yet!</p>
      } 
    </div>
  )
}