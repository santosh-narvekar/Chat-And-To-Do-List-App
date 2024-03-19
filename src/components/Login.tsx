import { useNavigate } from "react-router-dom";
import { getStorageUser, signIn, signUp } from "../backend/Queries";
import Button from "./Button"
import Input from "./Input"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { authDataType } from "../types";
import { setUser } from "../Redux/userSlice";

const Login = () => {
  {/* STATE */}
  const [login,setLogin] = useState(true);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [signUpLoading,setSignUpLoading]=useState(false);
  const [signInLoading,setSignInLoading]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = getStorageUser();
  
  useEffect(()=>{
    if(currentUser?.id){
      navigate('/dashboard')
      localStorage.setItem("currentUserPage",'');
      dispatch(setUser(currentUser));
    }
  },[navigate])

  const handleSignUp = () => {
    const data = {email,password,confirmPassword}
    auth(data,signUp,setSignUpLoading)
  }

  const handleSignIn = () => {
    const data = {email,password}
    auth(data,signIn,setSignInLoading);
  }

  const auth = (
      data:authDataType,
      func:any ,
      setLoading:React.Dispatch<React.SetStateAction<boolean>>
    ) => { 
      func(data,setLoading,reset,navigate,dispatch)
  }
  
  const reset = ()=>{
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    //navigate('/dashboard')
  }

  return (
   <div className="w-full md:w-[455px]">
        <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">
          {login?'Login':'Register'}</h1>
      <div className="bg-white p-6 min-h-[150px] flex flex-col gap-3 w-full rounded-xl drops-shadow-xl ">
       <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
       <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
       {!login && <Input name="confirmPassword" type="password" value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)} />}
       

    {
      login?
       <>
       <Button text={'Login'}  onClick={handleSignIn} loading={signInLoading} />
       <Button text={'Register'} secondary   onClick={() => setLogin(!login)} />
       </>
       :
       <>
        <Button text={'Register'} loading={signUpLoading}  onClick={handleSignUp} />
        <Button text={'Login'} secondary  onClick={() => setLogin(!login)} />
       </>
    }

      </div>
      </div>
  )
}

export default Login
