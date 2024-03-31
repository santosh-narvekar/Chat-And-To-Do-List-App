

// loaders for task list
export  function ListLoaders() {

  return <div className="w-full flex flex-wrap gap-10 justify-center">
    {
      [1,2,3,4,5,6,7,8,9].map((el)=>{
        return <SingleListLoader key={el} />
      })
    }
  </div>
}


function SingleListLoader(){
  return <div className="relative bg-gray-200 shadow rounded-md 
  max-w-sm w-full
  ">
    <div className=" animate-pulse flex-col ">
      <div className = " h-14 bg-gray-300 rounded-t-md ">
      </div>
      <div className=" flex-1 space-y-3 p-10 "></div>
    </div>

    <div className="absolute animate-pulse -bottom-4 -left-4 
    bg-gray-300 h-10 w-10 rounded-full
    ">

    </div>
  </div>
}

export const TaskListTasksLoader=()=>{
  return <div className="animate-pulse flex-1 space-y-3 p-4 pb-10">
    <div className="h-2 bg-gray-300 rounded"></div>
    <div className="h-2 bg-gray-300 rounded"></div>
    <div className="h-2 bg-gray-300 rounded"></div>
  </div>
}

// loader for left sideba
export const UsersLoader = () => {
  return <div className="flex flex-col  ">
  {
  [1,2,3,4,5,6,7,8].map((i)=>{
      return <UserLoader key={i} />
    })
  }
  </div>
}

export const UserLoader=() => {
  return <div className = " animate-pulse flex  gap-2 items-center px-5 py-3 border-b-[1px] border-gray-200 ">
    <div className = "rounded-full w-11 h-11 bg-gray-300">
    </div>
    <div className = "flex flex-col gap-2 w-[70%]">
      <div className="bg-gray-300 h-3 rounded-md"></div>
      <div className="bg-gray-300 h-3 rounded-md"></div>
    </div>
  </div>
}

export const MessageLoader=()=>{
  return(
    <div className="flex-1 overflow-y-scroll">
    {
      [1,2,3,4,5,6].map((m)=>{
        return <SingleMessageLoader key={m} />
      })
    }
    </div>
  )
}

const SingleMessageLoader=()=>{
  return (
    <div className="animate-pulse flex flex-col gap-10">
      <div
      className="bg-gray-200 h-12 w-full rounded-t-full rounded-br-full border-2 border-white self-start max-w-sm"
      ></div>
      <div className="bg-gray-300 h-12 w-full mb-5 rounded-t-full border-2 border-white self-end
      max-w-sm rounded-bl-full
      " ></div>
    </div>
  )
}