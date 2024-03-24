// for catching firebase errors

import { toastError, toastInfo } from "./toast";

const CatchErr = (err : { code?: string }) => {
  const {code} = err;
  if(code=== "auth/invalid-email") toastError("Invalid Email");
  else if(code==="auth/weak-password") toastError("passwords should be atleast 6 characters");
  else if(code==="auth/user-not-found") toastError("user not found!")
  else if(code==="auth/email-already-in-use") toastError("email already Exists")
  else if(code==="auth/wrong-password") toastError("wrong password");
  else if(code==="auth/unavailable") toastError("can't fetch your request at this time")
  else if(code==="auth/requires-recent-login") toastInfo("logout and login again ");
  else if(code === "auth/invalid-login-credentials") toastError('invalid login credentials')
  else if(code ==="auth/invalid-credential") toastError('invalid login credentials!')
  else if(code==="auth/operation-not-allowed") toastError('email  not updating now!');
  else toastError("An error occured!");
  console.log(err.code)
}

export default CatchErr