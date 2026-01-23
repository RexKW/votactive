import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth"
import { auth } from "../FirebaseConf";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserRole } from "../apis/UserCRUD";

interface IUserAuthProviderProps {
    children: React.ReactNode
}

type AuthContextData = {
    user: User | null;
    role: string | null;
    loading: boolean;
    logIn: typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
}

const logIn = (email: string, password: string) =>{
    return signInWithEmailAndPassword(auth, email, password)
}

const signUp = (email: string, password: string) =>{
    return createUserWithEmailAndPassword(auth, email, password)
}

const logOut = () =>{
    return signOut(auth);
}

const googleSignIn = () =>{
    const googleAuthProvider = new GoogleAuthProvider
    return signInWithPopup(auth, googleAuthProvider)

}

export const userAuthContext = createContext<AuthContextData>({
    user: null,
    role: null,
    loading: true,
    logIn,
    signUp,
    logOut,
    googleSignIn,
});

export const UserAuthProvider: React.FunctionComponent<IUserAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // 1. Reset loading to true on auth state change
            setLoading(true);
            
            try {
                if (currentUser) {
                    setUser(currentUser);
                    // 2. Try to get the role
                    const r = await getUserRole(currentUser.uid);
                    setRole(r);
                } else {
                    setUser(null);
                    setRole(null);
                }
            } catch (error) {
                console.error("Critical Auth Error:", error);
                // If fetching role fails, we still let the user be "logged in" but without a role
                // or you can set user to null if you prefer.
                setUser(null); 
                setRole(null);
            } finally {
                // 3. CRITICAL FIX: This runs 100% of the time, even if the code above crashes.
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value: AuthContextData = {
        user,
        role,
        loading,
        logIn,
        signUp,
        logOut,
        googleSignIn,
    };

    return (
        <userAuthContext.Provider value={value}>
            {children}
        </userAuthContext.Provider>
    );
};

export const useUserAuth = () =>{
    return useContext(userAuthContext)
}