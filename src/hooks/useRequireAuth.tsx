import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth';

const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log('Aucun utilisateur connecté');
      router.push('/');
    }
  }, [user, loading, router]);
};

export default useRequireAuth;
