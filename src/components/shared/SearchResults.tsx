import { Models } from "appwrite";
import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchedPosts: Models.Document[];
}

const SearchResults = ( { isSearchFetching, searchedPosts } : SearchResultsProps) => {
  if(isSearchFetching) {
    return (
        <div className="flex-center"><Loader /></div>
    )
  }

  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
        <GridPostList posts={searchedPosts.documents}/>
    )
  }
    return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults