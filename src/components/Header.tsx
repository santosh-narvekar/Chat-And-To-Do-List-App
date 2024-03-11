import Button from "./Button"

const logo = require('../assets/logo.png')
type Props = {}

export default function Header({}: Props) {
  return (
    <div className="drop-shadow-md bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white
      flex flex-wrap sm:flex-row gap-5 items-center justify-between">
      <img className="w-[70px] drop-shadow-md" src={logo} alt="logo" />
      <div className="flex">
      <Button text="Add New ListBoard" secondary/>
      </div>
    </div>
  )
}