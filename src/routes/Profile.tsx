import React from 'react';
import Header from '../components/Header';

function Profile() {
  return (
    <div>
      <Header hideLoginBtn />
      <div className="profile">
        <div className="title">Welcome, {'{name}'}</div>
        <div className="need-attention section">
          <div className="title">These TICS need your attention.</div>
          <div className="tics">
            <a href="/tic/1234567">
              <div className="tic-link">TIC 1234567</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
