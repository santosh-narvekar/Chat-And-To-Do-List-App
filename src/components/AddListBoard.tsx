import Button from "./Button"
import Icon from "./Icon"
import {MdAdd} from "react-icons/md"
type Props = {}

export default function AddListBoard({}: Props) {
  return (
    <>
       <Button text="Add New ListBoard"
       className="hidden md:flex"
       secondary />
       <Icon IconName={MdAdd} className="block md:hidden"/>
    </>
  )
}