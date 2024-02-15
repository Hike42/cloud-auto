import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth';

const useAuthWithRole = (requiredRole: string) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || role !== requiredRole) {
      router.push('/');
    }
  }, [user, role, loading, router, requiredRole]);

  return { user, role };
};

export default useAuthWithRole;
