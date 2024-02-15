import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  role: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSetUser = useCallback(async (user: User | null) => {
    setUser(user);
    setLoading(true);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          console.log('Aucun document pour cet utilisateur !');
          setRole(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du rôle de l'utilisateur",
          error,
        );
        setRole(null);
      }
    } else {
      setRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleSetUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [handleSetUser]);

  return (
    <AuthContext.Provider
      value={{ user, setUser: handleSetUser, role, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
};
