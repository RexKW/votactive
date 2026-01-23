import app, { auth } from "../FirebaseConf"; // 1. Import 'app' instead of 'db'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

import { 
  getFirestore, // 2. Import 'getFirestore' to create db here
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore"; 

// 3. Initialize db LOCALLY to guarantee it matches the functions below
const db = getFirestore(app);

type FirebaseUserInfo = {
    uid: string;
    email: string | null;
    username?: string | null;
};

const register = async (username: string, email: string, password: string, defaultRole = "voter") => {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, {
            uid: user.uid,
            email: user.email,
            username: username,
            role: defaultRole,
            createdAt: new Date().toISOString(),
        });
        return { uid: user.uid, email: user.email, username } as FirebaseUserInfo;
    } catch (error) {
        console.error("Firebase register error:", error);
        throw error;
    }
};

const login = async (email: string, password: string) => {
    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        return { uid: user.uid, email: user.email } as FirebaseUserInfo;
    } catch (error) {
        console.error("Firebase login error:", error);
        throw error;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase logout error:", error);
        throw error;
    }
};

const getUserRole = async (uid: string) => {
    try {
        const userRef = doc(db, "users", uid);

        // DEBUG: Verify db type (Optional)
        // console.log("DB Type:", db.type); 

        const rolesRef = collection(db, "roles");
        const q = query(rolesRef, where("user", "==", userRef));
        const roleSnapshot = await getDocs(q);

        if (!roleSnapshot.empty) {
            const data = roleSnapshot.docs[0].data();
            return data.role as string;
        }

        const userDoc = doc(db, "users", uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const data = userSnap.data();
            return data.role as string | null;
        }

        return null;
    } catch (error) {
        console.error("getUserRole error:", error);
        return null;
    }
};

export { register, login, logout, getUserRole };