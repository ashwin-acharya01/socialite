import { useUserContext } from "@/context/AuthContext";
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button"

const Topbar = () => {
  const { mutateAsync: signOutUser, isSuccess } = useSignOutMutation();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if(isSuccess){
      navigate(0);
    }
  }, [isSuccess]);

  return (
    <section className="topbar flex items-center justify-between px-8 py-4">
        <h2 className="h2-bold">Socialite</h2>
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => signOutUser()}><HiOutlineLogout className="color-primary-500 size-8"/></Button>
          <Link to={`/profile/${user.id}`}>
            <img className="h-8 w-8 rounded-full" src={user.imageUrl || '/assets/image/profile.png'} alt="profile-img"/>
          </Link>
        </div>
    </section>
  )
}

export default Topbar