import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const getAccessToken = async (code?: string): Promise<string> => {
  if (code) {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    return data.body.access_token;
  } else if (spotifyApi.getRefreshToken()) {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  }
  throw new Error('No code or refresh token available');
};

export const getTrackAnalysis = async (token: string, trackId: string) => {
  spotifyApi.setAccessToken(token);
  const response = await spotifyApi.getAudioAnalysisForTrack(trackId);
  return response.body;
};
