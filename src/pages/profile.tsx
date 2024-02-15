import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { db, auth } from '../../utils/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Annonce {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  userId: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnonces = async () => {
      if (user) {
        const q = query(collection(db, 'ads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const annoncesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Annonce, 'id'>),
        }));
        setAnnonces(annoncesData);
      }
    };
    fetchAnnonces();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await deleteDoc(doc(db, 'ads', id));
        setAnnonces(annonces.filter((annonce) => annonce.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce :", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <span>{user?.email}</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/home">Retour aux annonces</Link>
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Déconnexion
        </button>
      </div>
      <h1 className="text-center font-bold my-4">Mes annonces</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {annonces.map((annonce) => (
          <div
            key={annonce.id}
            className="border rounded shadow p-4 flex flex-col items-center"
          >
            <img
              src={annonce.imageUrl || 'https://via.placeholder.com/150'}
              alt={annonce.title}
              className="mb-2 max-h-40 w-full object-cover rounded"
            />
            <h2 className="text-lg font-bold mb-2">{annonce.title}</h2>
            <p className="mb-2">Prix: {annonce.price}€</p>
            <div className="flex">
              <button
                onClick={() => handleDelete(annonce.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Supprimer
              </button>
              <Link
                href={`/updateadform/${annonce.id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-4"
              >
                Modifier
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
