declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => Spotify.Player;
    };
  }

  namespace Spotify {
    interface Player {
      addListener(
        event: 'ready',
        callback: ({ device_id }: { device_id: string }) => void
      ): void;
      addListener(
        event: 'player_state_changed',
        callback: (state: PlayerState | null) => void
      ): void;
      connect(): void;
      disconnect(): void;
    }

    interface PlayerState {
      track_window: {
        current_track: {
          id: string;
        };
      };
    }
  }
}
