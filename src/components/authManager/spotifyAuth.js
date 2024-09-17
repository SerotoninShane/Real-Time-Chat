import React from 'react';

const clientId = '924426f47bcc423d9f68465fda4b068b';
const redirectUri = 'http://localhost:3000/callback'; // Update based on your environment
const scopes = [
  'streaming',  // Required for controlling playback
  'user-read-playback-state',
  'user-modify-playback-state'
].join('%20'); // Join scopes with URL encoded space (%20)

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

const SpotifyLogin = () => {
  return (
    <div>
      <a href={SPOTIFY_AUTH_URL}>
        <button>Login to Spotify</button>
      </a>
    </div>
  );
};

export default SpotifyLogin;