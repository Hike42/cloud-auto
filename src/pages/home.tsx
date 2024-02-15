import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../utils/firebaseConfig';
import Link from 'next/link';
import { useAuth } from '../auth';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import Modal from '../modal';
import useAuthWithRole from '@/hooks/useAuthWithRole';

interface Annonce {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  userId: string;
}

const Annonces = () => {
  useAuthWithRole('client' || 'vendeur');
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user, role } = useAuth();
  const [cart, setCart] = useState<Annonce[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadAnnonces = async () => {
      if (!auth.currentUser) {
        console.log('Aucun utilisateur connecté');
        return;
      }

      try {
        const q = query(
          collection(db, 'ads'),
          where('userId', '!=', auth.currentUser.uid),
        );

        const querySnapshot = await getDocs(q);
        const annoncesData: Annonce[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Annonce, 'id'>),
        }));

        console.log(annoncesData);
        setAnnonces(annoncesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      }
    };

    loadAnnonces();
  }, []);

  const filteredAnnonces = annonces.filter((annonce) =>
    annonce.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log(role);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const addToCart = (annonce: Annonce) => {
    setCart((currentCart) => [...currentCart, annonce]);
  };

  const removeFromCart = (annonceId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== annonceId),
    );
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  const notifyCart = () => {
    alert('Commande passée avec succès !');
    setCart([]);
  };

  return (
    <div className="bg-gray-800 text-white p-5">
      {user && (
        <div className="flex justify-between mb-4">
          <p>Email: {user.email}</p>
          <h2 className="text-2xl font-bold">Annonces</h2>
          <p>Rôle: {role}</p>
        </div>
      )}
      <div className="flex mb-4 items-center">
        <input
          type="text"
          placeholder="Rechercher dans les titres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full mr-4 bg-white text-black"
        />
        {role === 'vendeur' && (
          <div className="flex">
            <Link href="/createadform">
              <p className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 justify-center flex items-center mr-4">
                Créer
              </p>
            </Link>
            <Link href="/profile">
              <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 justify-center flex items-center">
                Profil
              </p>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Déconnexion
            </button>
          </div>
        )}
        {role === 'client' && (
          <div className="flex">
            <button
              onClick={toggleCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Panier
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAnnonces.map((annonce) => (
          <div
            key={annonce.id}
            className="border rounded shadow p-4 flex flex-col items-center bg-gray-800 text-white"
          >
            <h2 className="text-lg font-bold mb-2">{annonce.title}</h2>
            <p className="mb-2">Prix: {annonce.price}€</p>
            {annonce.imageUrl && (
              <div className="h-40 w-full overflow-hidden mb-4">
                <img
                  src={annonce.imageUrl}
                  alt={annonce.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {role === 'client' && (
              <button
                onClick={() => addToCart(annonce)}
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Acheter
              </button>
            )}
          </div>
        ))}
      </div>
      {isCartVisible && (
        <Modal isOpen={true} onClose={toggleCart} title="Votre panier">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 border-b border-gray-700"
              >
                <span>
                  {item.title} - {item.price}€
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Supprimer
                </button>
              </div>
            ))
          ) : (
            <p>Votre panier est vide.</p>
          )}
          <div className="mt-4 flex justify-between">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  notifyCart();
                  toggleCart();
                }}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Commander
              </button>
            )}
            <button
              onClick={toggleCart}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Annonces;
