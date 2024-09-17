import React, { useEffect } from 'react';
import axios from 'axios';

const SpotifyCallback = () => {
  useEffect(() => {
    const getToken = async (code) => {
      const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'your_spotify_client_id',
        client_secret: 'your_spotify_client_secret'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = response.data.access_token;
      localStorage.setItem('spotifyAccessToken', accessToken);
      console.log('Access Token:', accessToken);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      getToken(code);
    }
  }, []);

  return <div>Logging in...</div>;
};

export default SpotifyCallback;
