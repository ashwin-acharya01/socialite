import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isLiked, setIsLiked] = useState(checkIsLiked(likesList, userId));
  const [isSaved, setIsSaved] = useState(false);

  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { mutateAsync: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const handleLikedPost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if(hasLiked) {
        newLikes = newLikes.filter((id) => id !== userId);
        setIsLiked(false);
    } else {
        newLikes.push(userId);
        setIsLiked(true);
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser])

  const handleSavePost = (e : React.MouseEvent) => {
    e.stopPropagation();

    if(savedPostRecord) {
        setIsSaved(false);
        deleteSavedPost(savedPostRecord.$id);
    }else {
        savePost({ postId: post?.$id || "", userId: userId });
        setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2">
        <img
          src={checkIsLiked(likesList, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLikedPost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSavedPost ? <Loader /> : (
            <img
              src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
              alt="like"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
        )}
      </div>
    </div>
  );
};

export default PostStats;
