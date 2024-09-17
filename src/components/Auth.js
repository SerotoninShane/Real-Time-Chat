import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { GoogleSignInButton } from './authManager';

import { AudioPlayer } from './AudioPlayer';

export const Auth = () => {
  const navigate = useNavigate();
  
  return (
    <section className="auth">

      <div className="main-container">
        <div></div>
      <GoogleSignInButton navigate={navigate} />
      </div>

      <div className="vinyl">
        <img src='/vinyl.webp' alt='music albumn cover' className="vinyl-image" />
      </div>

      <div className="main-container">
        <div></div>
            <button onClick={() => navigate('/roomBuilder')}> Join </button>
      </div>

      <AudioPlayer/>

    </section>
  );
};

