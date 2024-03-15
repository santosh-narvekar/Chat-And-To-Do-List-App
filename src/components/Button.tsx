import Spinner from "./Spinner";

type ButtonProps = {
  text:string;
  className?:string;
  secondary?:boolean;
  onClick?:() => void;
  loading?:boolean
}

export default function Button({ text="loading...",className,secondary,onClick,loading }: ButtonProps) {
  return (
    <button className = {`py-2 px-9 rounded-full text-white border-2 border-white hover:bg-myPink 
    transition-all hover:drop-shadow-lg ${secondary?'bg-myPink':'bg-myBlue'}
    ${className} flex justify-center items-center gap-3 
    `}
    onClick={onClick}
    disabled={loading}
    >
      { loading && <Spinner /> }
      { text }
    </button>
  )
}