import React from 'react';
import GoogleLogin from 'react-google-login';
import { handleLogin } from '../GoogleAuth';

function Header({ hideLoginBtn = false }: { hideLoginBtn?: boolean }) {
  return (
    <div className="header">
      <a href="/">
        <div className="title">Planet Patrol</div>
      </a>
      {!hideLoginBtn && (
        <div className="login" onClick={() => (window.location.href = '/profile')}>
          Log In
        </div>
      )}
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
        buttonText={'Log in with Google'}
        cookiePolicy={'single_host_origin'}
        onSuccess={handleLogin}
        onFailure={handleLogin}
      />
    </div>
  );
}

export default Header;
