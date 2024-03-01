import Bottombar from "@/components/shared/Bottombar"
import Sidebar from "@/components/shared/Sidebar"
import Topbar from "@/components/shared/Topbar"
import { Outlet } from "react-router-dom"

const PrivateLayout = () => {
  return (
    <main className="w-full md:flex">
      {/* topbar */}
      <Topbar />

      {/* sidebar */}
      <Sidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      {/* bottombar */}
      <Bottombar />
    </main>
  )
}

export default PrivateLayout