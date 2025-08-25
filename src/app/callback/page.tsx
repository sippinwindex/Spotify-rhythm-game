'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getAccessToken } from '@/lib/spotify';

const Callback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        await getAccessToken(code);
        router.push('/');
      }
    };
    handleCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
