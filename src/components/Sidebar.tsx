
type SidebarTypes = {
  children?:React.JSX.Element;
  isRight?:boolean;
  className?:string;
}

export default function Sidebar({children,isRight,className}:SidebarTypes) {
  return (
    <div className={`bg-white lg:flex-[0.3] 
    duration-75
    shadow-md border-2 overflow-scroll  ${isRight?'rounded-tr-3xl rounded-br-3xl':"rounded-tl-3xl rounded-bl-3xl"}
    ${className}
    `}
    >
      {children}
    </div>
  )
}