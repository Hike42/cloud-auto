import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../utils/firebaseConfig"; // Ajustez le chemin selon votre projet
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; // Assurez-vous que ce chemin est correct

// Ajouter 'setUser' dans 'AuthContextType' et ajouter 'role'
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; // Ajout de setUser
  role: string | null; // Ajout du rôle de l'utilisateur
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // État pour le rôle
  const [loading, setLoading] = useState<boolean>(true);

  const handleSetUser = useCallback(async (user: User | null) => {
    setUser(user);
    setLoading(true); // Commence par indiquer que le chargement est en cours
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role); // Met à jour l'état avec le rôle récupéré
        } else {
          console.log("Aucun document pour cet utilisateur !");
          setRole(null); // Réinitialise le rôle si aucun document n'est trouvé
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du rôle de l'utilisateur",
          error
        );
        setRole(null); // Gestion des erreurs
      }
    } else {
      setRole(null); // Réinitialise le rôle si aucun utilisateur n'est connecté
    }
    setLoading(false); // Indique la fin du chargement
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleSetUser(user);
      setLoading(false);
    });

    return unsubscribe; // Fonction de nettoyage qui se désabonne de l'écouteur d'authentification
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
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
