import Button from "./Button"
import Input from "./Input"
import { useState } from "react"

const Login = () => {
  {/* STATE */}
  const [login,setLogin] = useState(true);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword] = useState("");


  const handleSignUp = () => {
    const data = {email,password,confirmPassword}
    console.log(data)
  }

  const handleSignIn = () => {
    const data = {email,password}
    console.log(data);
  }

  return (
   <div className="w-full md:w-[455px]">
        <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">
          {login?'Login':'Register'}</h1>
      <div className="bg-white p-6 min-h-[150px] flex flex-col gap-3 w-full rounded-xl drops-shadow-xl ">
       <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
       <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
       {!login && <Input name="confirm-password" type="password" value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)} />}
       

    {
      login?
       <>
       <Button text={'Login'}  onClick={handleSignIn} />
       <Button text={'Register'} secondary   onClick={() => setLogin(!login)} />
       </>
       :
       <>
        <Button text={'Register'}   onClick={handleSignUp} />
        <Button text={'Login'} secondary  onClick={() => setLogin(!login)} />
       </>
    }

      </div>
      </div>
  )
}

export default Login
