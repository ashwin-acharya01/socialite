import { UserType } from "@/types";
import { ID, Query } from "appwrite";
import { account, AppwriteConfig, avatars, databases, storage } from "./config";

export async function createUser(user: UserType) {
  try {
    const newUserAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newUserAccount) throw "Failed to create new user";

    const avatarURL = avatars.getInitials(user.name);

    const newUser = await addUserToCollection({
      account_id: newUserAccount.$id,
      email: newUserAccount.email,
      name: newUserAccount.name,
      username: user.username,
      image_url: avatarURL,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const addUserToCollection = async (user: {
  account_id: string;
  email: string;
  name: string;
  username?: string;
  image_url: URL;
}) => {
  try {
    const newUser = databases.createDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseUserId,
      ID.unique(),
      user
    );

    if (!newUser) throw "Could not add new user.";
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const SignInUser = async (user: { email: string; password: string }) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
};

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw "Could not find current account";

    const currentUser = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseUserId,
      [Query.equal("account_id", currentAccount.$id)]
    );

    if (!currentUser) throw "Could not find current user";

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export const SignOutUser = async () => {
  try {
    const clearSession = await account.deleteSession("current");

    return clearSession;
  } catch (error) {
    console.log(error);
    return;
  }
};

export async function createPost(post: any) {
  try {
    const uploadedFile = await uploadFile(post?.file[0]);

    if (!uploadedFile) throw "Couldn't Upload File";

    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw "Couldn't Preview File";
    }

    // convert tags into array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Sav the post to database
    const newPost = await databases.createDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        image_url: fileUrl,
        image_id: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw "Error while creating post";
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      AppwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      AppwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(AppwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    AppwriteConfig.databaseId,
    AppwriteConfig.databasePostsId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
}

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const likedPost = await databases.updateDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!likedPost) throw Error;

    return likedPost;
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (postId: string, userId: string) => {
  try {
    const savedPost = await databases.createDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseSavesId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!savedPost) throw Error;

    return savedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const savedPost = await databases.deleteDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseSavesId,
      savedRecordId
    );
    if (!savedPost) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
  }
};

export async function updatePost(post: any) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post?.file[0]);

      if (!uploadedFile) throw "Couldn't Upload File";

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw "Couldn't Preview File";
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // convert tags into array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Sav the post to database
    const updatedPost = await databases.updateDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      post.postId,
      {
        caption: post.caption,
        image_url: image.imageUrl,
        image_id: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw "Error while creating post";
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export const deletePost = async (postId: string, imageId: string) => {
  if (!imageId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.databasePostsId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSavedPosts = async (userId: string) => {
  try {
    const savedPosts = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseSavesId,
      [Query.equal("user", [userId])]
    );

    if (!savedPosts) {
      throw Error;
    }

    return savedPosts?.documents.map((item) => {
      return item?.post;
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    const userData = await databases.getDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseUserId,
      userId
    );

    if (!userData) throw Error;

    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (userData: any) => {
  const hasFileToUpdate = userData.file.length > 0;

  try {
    let image = {
      imageUrl: userData.imageUrl,
      imageId: userData.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(userData?.file[0]);

      if (!uploadedFile) throw "Couldn't Upload File";

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw "Couldn't Preview File";
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // convert tags into array

    // Sav the post to database
    const updatedUser = await databases.updateDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseUserId,
      userData.id,
      {
        name: userData.name,
        image_url: image.imageUrl,
        image_id: image.imageId,
        username: userData.username,
        // isAccountPrivate: userData.isAccountPrivate,
        bio: userData.bio,
      }
    );

    if (!updatedUser) {
      await deleteFile(userData.imageId);
      throw "Error while creating post";
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserAttributes = async (userId: string, updatedObject : any) => {
  try {
    const update = await databases.updateDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.databaseUserId,
      userId,
      updatedObject
    );

    if(!update) throw Error;

    return update;

  } catch(error) {
    console.log(error);
  }
}

export const UpdateUserFollowerDetails = async (targetUser: string, user: string) => {
  try {
    if(targetUser === "" || user === "") return {
      status: "failed"
    }

    const currentUserFollowings = await fetchUser(user).then(
      (data) => data?.following
    );

    const targetUserFollowers = await fetchUser(targetUser).then(
      (data) => data?.followers
    );
    
    let modifiedCurrentUserFollowings = [...currentUserFollowings];
    if(!currentUserFollowings.includes(targetUser)) modifiedCurrentUserFollowings.push(targetUser);
    

    let modifiedTargetUserFollowers = [...targetUserFollowers];
    if(!targetUserFollowers.includes(user)) modifiedTargetUserFollowers.push(user);

    
    const updatedUser = await updateUserAttributes(user,{
        following: modifiedCurrentUserFollowings,
      }
    );

    if(!updatedUser){
      throw Error;
    }

    const updatedTargetUser = await updateUserAttributes(targetUser,{
        followers: modifiedTargetUserFollowers,
      }
    );

    if(!updatedTargetUser){
      // Rollback changes
      await updateUserAttributes(user, {
        following: currentUserFollowings
      })
      throw Error;
    }

    return {
      status: 'ok'
    }

  } catch (error) {
    console.log(error);
  }
};


export const unFollowUser = async (targetUser: string, user: string) => {
  try {
    
    if(targetUser === "" || user === "") return {
      status: "failed"
    }

    const currentUserFollowings = await fetchUser(user).then(
      (data) => data?.following
    );

    const targetUserFollowers = await fetchUser(targetUser).then(
      (data) => data?.followers
    );
    
    let modifiedCurrentUserFollowings = [...currentUserFollowings];
    if(currentUserFollowings.includes(targetUser)) modifiedCurrentUserFollowings = modifiedCurrentUserFollowings.filter((user) => user !== targetUser);
    

    let modifiedTargetUserFollowers = [...targetUserFollowers];
    if(targetUserFollowers.includes(user)) modifiedTargetUserFollowers = modifiedTargetUserFollowers.filter((curUser) => curUser !== user);

    console.log(modifiedTargetUserFollowers, modifiedCurrentUserFollowings);

    
    const updatedUser = await updateUserAttributes(user,{
        following: modifiedCurrentUserFollowings,
      }
    );

    if(!updatedUser){
      throw Error;
    }

    const updatedTargetUser = await updateUserAttributes(targetUser,{
        followers: modifiedTargetUserFollowers,
      }
    );

    if(!updatedTargetUser){
      // Rollback changes
      await updateUserAttributes(user, {
        following: currentUserFollowings
      })
      throw Error;
    }

    return {
      status: 'ok'
    }

  } catch (error) {
    console.log(error);
  }
}
