export type setLoadingType = React.Dispatch<React.SetStateAction<boolean>>

export type authDataType = {
  email:string,
  password:string,
  confirmPassword?:string
}

export type userType = {
  id:string,
  username:string,
  email:string,
  isOnline:boolean,
  img:string,
  bio?:string,
  creationTime?:string,
  lastSeen?:string
}