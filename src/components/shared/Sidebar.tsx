import { SidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext"
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button";

const Sidebar = () => {
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { mutateAsync: signOutUser, isSuccess } = useSignOutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if(isSuccess){
      navigate(0);
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar h-[100vh]">
      <h2 className="h2-bold w-full text-center">Socialite</h2>
      <div className="flex flex-col gap-10 mt-6">
        <Link to={`/profile/${user.id}`} className="w-full flex items-center gap-3">
            <img className="h-16 w-16 rounded-full" src={user.imageUrl || '/assets/image/profile.png'} alt="profile-img"/>
            <div className="flex flex-col gap-3">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular">{user.username}</p>
            </div>
        </Link>
        <ul className="flex flex-col gap-6 mb-10">
          {SidebarLinks.map(link => {
            const isActive = link.route === pathname;
            return (
              <li className={`leftsidebar-link cursor-pointer ${isActive && `bg-primary-500`}`} key={link.label}>
                <div className="flex items-center gap-4 p-4">
                  {link.icons}
                  <NavLink to={link.route} >{link.label}</NavLink>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Button variant="ghost" className="w-full mt-auto inline-flex justify-start gap-6 hover:text-primary-500" onClick={() => signOutUser()}><HiOutlineLogout className="color-primary-500 size-8 text-left"/>&nbsp;Logout</Button>
    </nav>
  )
}

export default Sidebar