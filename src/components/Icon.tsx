import { IconType } from "react-icons"

type Props = {
  IconName:IconType,
  size?:number,
  className?:string, // for extra styles if any
  loading?:boolean,
  ping?:boolean, // for messages notification
  reduceOpacityOnHover?:boolean,
  onClick?:()=>void
}

export default function Icon({IconName,
  size,
  className,
  loading,
  ping,
  reduceOpacityOnHover,
  onClick}: Props) {
  return (
    <button onClick={onClick} disabled={loading} className={` relative p-3 rounded-full cursor-pointer 
    hover:bg-myBlue ${reduceOpacityOnHover ? " hover:bg-opacity-30 " : "bg-myBlue text-white border-2 border-white hover:drop-shadow-lg " }
    ${loading && 'cursor-wait'}
    ${className}
    `}
    >
      {loading?"Loading":<IconName size={size} />}
      
      {ping && (<>
      <span className="absolute border-2 -top-1 left-7 w-3 h-3 
  border-gray-800 rounded-full bg-myPink"></span>
  
  <span className="animate-ping absolute -top-1 left-7 w-3 h-3 
  border-gray-800 rounded-full bg-myPink"></span>
      </>)}
    </button>
  )
}