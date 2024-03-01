import { getCurrentUser } from "@/lib/appwrite/api";
import { ContextType, NewUser, UserType } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<ContextType>(INITIAL_STATE);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [user, setUser] = useState<NewUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // console.log(location);

    // checks for current user and sets it to the user state
    const checkAuthUser = async () => {
        try{
            const currentUser = await getCurrentUser();

            if(currentUser){
                setUser({
                    id: currentUser.$id,
                    name: currentUser.name,
                    username: currentUser.username,
                    email: currentUser.email,
                    imageUrl: currentUser.imageUrl,
                    bio: currentUser.bio,
                })

                setIsAuthenticated(true);

                return true;
            }
            return false;
        }catch(error){
            console.log(error);
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    // On each page reload check whether we are still logged In
    useEffect(() => {
        if(localStorage.getItem("cookieFallback") === '[]' || localStorage.getItem("cookieFallback") === null){
            if(pathname !== '/login' && pathname !== '/register') navigate('/login');
        }
        else{
            if(pathname === '/login' || pathname === '/register') navigate('/login')
            checkAuthUser();
        }
    },[]);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);