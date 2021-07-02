import React from 'react';

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
    </div>
  );
}

export default Header;
