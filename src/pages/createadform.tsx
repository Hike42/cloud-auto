import { useState } from 'react';
import { db, storage, auth } from '../../utils/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import useAuthWithRole from '@/hooks/useAuthWithRole';

export default function CreateAdForm() {
  useAuthWithRole('vendeur');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
    if (!image || !userId) return;
    setUploading(true);

    const imageRef = ref(storage, `images/${userId}/${image.name}`);

    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);
    await addDoc(collection(db, 'ads'), {
      userId,
      title,
      price: Number(price),
      imageUrl: imageUrl,
    });

    setUploading(false);
    setTitle('');
    setPrice('');
    setImage(null);
    setImagePreview(null);
    alert('Annonce créée avec succès !');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="p-5 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Créer une annonce</h2>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'annonce"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            required
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
          {uploading ? 'Publication...' : "Publier l'annonce"}
        </button>
      </form>
      <button className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 mt-4">
        <a href="/home">Retour</a>
      </button>
    </div>
  );
}
