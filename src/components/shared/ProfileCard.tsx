
type ProfileCardProps = {
    imgUrl: string;
    name: string;
    followers: number | string;
    onFollow: ({targetUser, user} : {targetUser:string, user: string}) => ({status: string});
    onUnFollow: ({targetUser, user} : {targetUser:string, user: string}) => ({status: string});
}

const ProfileCard = ({imgUrl, name, followers, onFollow, onUnFollow} : ProfileCardProps) => {
  return (
    <div className="user-card max-w-44">
        <img src={imgUrl || '/assets/icons/profile-placeholder.svg'} className="w-40 h-40 rounded-full" alt="profile-image" />
    </div>
  )
}

export default ProfileCard