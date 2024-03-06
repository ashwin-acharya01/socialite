import UpdateProfileForm from "@/components/forms/UpdateProfileForm";
import { ProfilePhotoUploader } from "@/components/shared/FileUploader"
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFetchUser } from "@/lib/react-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: userData, isPending: isUserDataFetching } = useFetchUser(id || "");
  const navigate = useNavigate();

  if(id !== user.id){
    return (
      <div className="flex w-full items-center justify-center h-screen p-5">
        <p className="text-xl text-light-2">Hmmm... Looks like you don't have access to this page.&nbsp;<Button variant="link" className="text-primary-500 text-xl" onClick={() => navigate('/')}>Jump to home.</Button></p>
      </div>
    );
  }

  return (
    <div className="profile-container rounded-lg">
        <div className="w-full flex items-center justify-start gap-4">
          <img src={"/assets/icons/edit.svg"}  alt="edit-icon"/>
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        {
          userData === undefined ? (
            <div className="flex-center">Fetching User Data&nbsp;<Loader /></div>
          ) : (
            <UpdateProfileForm userData={userData}/>
          )
        }
        
      
    </div>
  )
}

export default UpdateProfile