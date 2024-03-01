import { Client, Account, Storage, Databases, Avatars } from 'appwrite';

export const AppwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_PROJECT_URL,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    databaseSavesId: import.meta.env.VITE_DATABASE_SAVES_ID,
    databasePostsId: import.meta.env.VITE_DATABASE_POSTS_ID,
    databaseUserId: import.meta.env.VITE_DATABASE_USER_ID,
}

export const client = new Client();
// console.log(import.meta.env.VITE_APPWRITE_PROJECT_ID);
client.setProject(AppwriteConfig.projectId);
client.setEndpoint(AppwriteConfig.url);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);