import UpdateProfileForm from "@/components/forms/UpdateProfileForm";
import { ProfilePhotoUploader } from "@/components/shared/FileUploader"
import Loader from "@/components/shared/Loader";
import { useFetchUser } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const { data: userData, isPending: isUserDataFetching } = useFetchUser(id || "");

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