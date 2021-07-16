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
        <GoogleLogin
          className="login"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
          buttonText={'Log in with Google'}
          cookiePolicy={'single_host_origin'}
          onSuccess={handleLogin}
          onFailure={handleLogin}
          render={renderGoogleButton}
        />
      )}
    </div>
  );
}

function renderGoogleButton(renderProps: any) {
  if (renderProps.disabled) return <div />;
  return (
    <div className="login" onClick={renderProps.onClick}>
      Log In
    </div>
  );
}

export default Header;
