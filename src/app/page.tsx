'use client';

import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import { getAccessToken } from '@/lib/spotify';

import RhythmGame from '@/components/RhythmGame';
import WebPlayback from '@/components/WebPlayback';

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  useEffect(() => {
    if (session) {
      const fetchToken = async () => {
        const token = await getAccessToken();
        setAccessToken(token);
      };
      fetchToken();
    }
  }, [session]);

  return (
    <div className='container mx-auto p-4'>
      {session ? (
        <>
          {accessToken && (
            <>
              <WebPlayback
                token={accessToken}
                setCurrentTrack={setCurrentTrack}
              />
              <RhythmGame
                token={accessToken}
                currentTrack={currentTrack ? currentTrack.id : null}
              />
            </>
          )}
        </>
      ) : (
        <button
          onClick={() => signIn('spotify')}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Login with Spotify
        </button>
      )}
    </div>
  );
};

export default Home;
