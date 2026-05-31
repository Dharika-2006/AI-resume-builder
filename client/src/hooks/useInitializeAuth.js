import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * useInitializeAuth
 * - Triggers the auth initialization on mount
 * - Returns loading state to allow root files or wrappers to check auth status
 */
export default function useInitializeAuth() {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { loading };
}
