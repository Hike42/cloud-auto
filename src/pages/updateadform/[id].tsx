import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, storage } from '../../../utils/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAuthWithRole from '@/hooks/useAuthWithRole';

interface Annonce {
  id?: string;
  title: string;
  price: number;
  imageUrl?: string;
}

const UpdateAdForm = () => {
  useAuthWithRole('vendeur');
  const [annonce, setAnnonce] = useState<Annonce>({ title: '', price: 0 });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchAnnonce = async () => {
      if (typeof id === 'string') {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnnonce({ id: docSnap.id, ...(docSnap.data() as Annonce) });
          setImagePreview(docSnap.data().imageUrl);
        } else {
          alert('Annonce non trouvée');
        }
      }
    };

    fetchAnnonce();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = annonce.imageUrl;

    if (image) {
      const imageRef = ref(storage, `images/${id}/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    if (typeof id === 'string') {
      const annonceRef = doc(db, 'ads', id);
      await updateDoc(annonceRef, {
        title: annonce.title,
        price: annonce.price,
        imageUrl,
      });
    }

    setUploading(false);
    alert('Annonce mise à jour avec succès !');
    router.push('/profile');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="p-5 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Modifier l&apos;Offre</h2>
        <div className="mb-4">
          <input
            type="text"
            value={annonce.title}
            onChange={(e) => setAnnonce({ ...annonce, title: e.target.value })}
            placeholder="Titre de l'annonce"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            value={annonce.price.toString()}
            onChange={(e) =>
              setAnnonce({ ...annonce, price: Number(e.target.value) })
            }
            placeholder="Prix en €"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Photo de l&apos;annonce
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full file:border file:border-gray-300 file:rounded-lg file:p-2 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-50"
          />
        </div>
        {imagePreview && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Prévisualisation de l&apos;image :
            </p>
            <img
              src={imagePreview}
              alt="Prévisualisation"
              className="w-full max-h-40 object-cover rounded-lg"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-blue-300"
        >
          {uploading ? 'Mise à jour...' : "Mettre à jour l'annonce"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAdForm;
