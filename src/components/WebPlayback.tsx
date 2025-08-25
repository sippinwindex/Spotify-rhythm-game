'use client';

import { useEffect, useState } from 'react';

type WebPlaybackProps = {
  token: string;
  setCurrentTrack: (track: Spotify.Track | null) => void;
};

const WebPlayback = ({ token, setCurrentTrack }: WebPlaybackProps) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify Rhythm Game Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener(
        'ready',
        ({ device_id: _device_id }: { device_id: string }) => {
          // eslint-disable-next-line no-console -- Allow for debugging
          console.log('Ready with Device ID', _device_id);
        }
      );

      spotifyPlayer.addListener(
        'player_state_changed',
        (state: Spotify.PlaybackState | null) => {
          if (state && state.track_window && state.track_window.current_track) {
            setCurrentTrack(state.track_window.current_track);
          } else {
            setCurrentTrack(null);
          }
        }
      );

      spotifyPlayer.connect();
    };

    return () => {
      document.body.removeChild(script);
      player?.disconnect();
    };
  }, [token, player, setCurrentTrack]);

  if (!token) return <div>Please sign in with Spotify.</div>;

  return <div>Spotify Player Loading...</div>;
};

export default WebPlayback;
