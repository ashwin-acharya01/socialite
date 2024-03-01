export interface UserType{
    name: string;
    username: string;
    email: string;
    password:string;
}

export interface NewUser{
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
}

export type ContextType = {
    user: NewUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<NewUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}