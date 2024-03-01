import GridPostList from "@/components/shared/GridPostList";
import { TabsComponent } from "@/components/shared/TabComponents";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFetchUser } from "@/lib/react-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { data: userData, isPending: isFetchingUserData } = useFetchUser(
    id || ""
  );
  const navigate = useNavigate();
  const { user } = useUserContext();
  // console.log(id);
  console.log(userData);

  return (
    <div className="profile-container">
      <div className="profile-inner-container w-full">
        {/* <div className="w-full flex items-center justify-start gap-4">
          <img src={"/assets/icons/edit.svg"}  alt="edit-icon"/>
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>


        </div> */}
        <div className="flex justify-start items-start gap-6 w-full">
          <img
            src={userData?.image_url}
            className="w-20 h-20 md:w-32 md:h-32 rounded-full"
            alt="profile-pic"
          />
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="h3-bold md:h2-bold">{userData?.name}</h3>
                <p className="small-medium md:base-regular text-light-3 mt-2">
                  @{userData?.username}
                </p>
              </div>
              <Button
                className="bg-primary-500 text-light-1 text-lg hidden md:block"
                variant="ghost"
                onClick={() => {
                  if(userData?.$id === user.id) navigate(`/update-profile/${user.id}`)
                }}
              >
                {userData?.$id === user.id ? "Update Profile" : "Follow"}
              </Button>
            </div>
            <div className="flex justify-start items-center gap-4 md:gap-8">
              <div className="flex flex-col items-start gap-1">
                <p className="text-2xl font-bold text-primary-500">
                  {userData?.posts.length}
                </p>
                <p className="text-xl text-light-1">Posts</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="text-2xl font-bold text-primary-500">
                  {userData?.following.length}
                </p>
                <p className="text-xl text-light-1">Following</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="text-2xl font-bold text-primary-500">
                  {userData?.followers.length}
                </p>
                <p className="text-xl text-light-1">Followers</p>
              </div>
            </div>
            <p
              className={`base-regular md:text-lg my-4 text-light-2 ${
                userData?.bio === "" ? "hidden" : "block"
              }`}
            >
              {userData?.bio}
            </p>
            <div className="md:hidden">
              <Button className="bg-primary-500 text-light-1 small-medium">
                {userData?.$id === user.id ? "Update Profile" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full flex-1 mt-6">
          <TabsComponent
            tabsListTitles={["Posts", "Liked"]}
            tabsContentList={[
              <GridPostList
                posts={userData?.posts}
                showUser={false}
                showStats={false}
              />,
              <GridPostList
                posts={userData?.liked}
                showUser={false}
                showStats={false}
              />,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
