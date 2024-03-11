import Input from "../components/Input"
import Login from "../components/Login"


const LoginPage = () => {
  return (
    <div className=" h-[100vh] flex items-center justify-center p-10">
      <Login />
      <div className="h-full w-full bg-gradient-to-r from-myBlue to-myPink absolute top-0 -z-10
      opacity-70
      " />
      <div className="h-full w-full absolute bg-bgImg -z-20 top-0"></div>
    </div>
  )
}

export default LoginPage
