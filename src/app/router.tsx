import Index from '@/app/pages/index';
import Login from '@/app/pages/login';
import { apikeyAtom } from '@/app/stores/apikey';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

/**
 * Pseudo-router that returns the appropriate page according to the current state (no actual routing)
 */
export default function Router() {
  const apiKey = useAtomValue(apikeyAtom);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  if (!apiKey) {
    return <Login />;
  } else {
    return <Index />;
  }
}
