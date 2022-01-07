import React, { useState } from 'react';
import { useEffect } from 'react';
import GoogleLogin from 'react-google-login';

function Header(props: { loggedInCallback?: Function }) {
  let [loggedIn, setLoggedIn] = useState(false);
  let [user, setUser]: [any, Function] = useState({});

  useEffect(() => {
    tryGetSelf(setLoggedIn, setUser);
  }, [setLoggedIn]);

  useEffect(() => {
    if (loggedIn && props.loggedInCallback) props.loggedInCallback(user);
  }, [loggedIn, props, user]);

  return (
    <div className="header">
      <a href="/">
        <div className="title">Planet Patrol</div>
      </a>
      <div className="links">
        <a href="/">Home</a>
        <div className="sep">|</div>
        <a href="/unpublished">Unpublished</a>
        <div className="sep">|</div>
        <a href="/dictionary">Dictionary</a>
        <div className="sep">|</div>
        <a href="https://github.com/Orion31Dev/Planet-Patrol-Vetting-Website/">GitHub</a>
      </div>
      {!loggedIn && (
        <GoogleLogin
          className="login"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
          buttonText={'Log in with Google'}
          cookiePolicy={'single_host_origin'}
          onSuccess={(g) => handleLogin(g, () => setLoggedIn(true), setUser)}
          onFailure={(g) => handleLogin(g, () => setLoggedIn(false), setUser)}
          render={renderGoogleButton}
        />
      )}
      {loggedIn && user !== {} && (
        <a className="login" href="/profile">
          {user.name}
        </a>
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

async function handleLogin(googleData: any, callback: Function, setUser: Function) {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      token: googleData.tokenId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 200) {
    callback();
    setUser(await res.json());
  } else setUser({});
}

async function tryGetSelf(callback: Function, setUser: Function) {
  const res = await fetch('/api/me', {
    method: 'GET',
  });

  if (res.status === 200) {
    callback(true);
    setUser(await res.json());
  } else {
    callback(false);
    setUser({});
  }
}

export default Header;
