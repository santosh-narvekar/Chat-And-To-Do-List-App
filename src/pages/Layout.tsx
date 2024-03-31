import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Alert from "../components/Alert"

type Props = {}

export default function Layout({}: Props) {
  return (
    <div className="h-[100vh] flex flex-col">
    <Header />
    <div className="bg-bgImg flex-1 max-h-[90%] overflow-y-scroll">
    <Outlet />
    </div>
    <Alert/>
    </div>

  )
}