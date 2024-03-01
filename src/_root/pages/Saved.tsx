import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useFetchSavedPosts } from "@/lib/react-query/queriesAndMutations"

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPost, isPending: isFetchingPost } = useFetchSavedPosts(user.id);

  // console.log(savedPost);

  if(isFetchingPost) {
    return (
        <div className="flex-center"><Loader /></div>
    )
  }

  if(savedPost && savedPost.length > 0) {
    return (
        <div className="saved-container">
          <div className="flex justify-start w-full">
            <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
          </div>
          <GridPostList posts={savedPost} showStats={false} />
        </div>
    )
  }
    return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default Saved