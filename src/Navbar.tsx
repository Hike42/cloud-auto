import Link from "next/link";
import { useAuth } from "./auth"; // Ajustez le chemin
import { auth } from "../utils/firebaseConfig"; // Ajustez le chemin
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
      <div>
        <Link href="/search">
          <p className="text-white mr-4">Recherche</p>
        </Link>
        {user && (
          <>
            <Link href="/profile">
              <p className="text-white mr-4">Mon profil</p>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
