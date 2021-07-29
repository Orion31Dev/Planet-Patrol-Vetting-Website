import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import Message404 from '../components/Message404';

function Profile() {
  let [user, setUser]: [any, Function] = useState(null);

  if (!user || !user._id) {
    return (
      <div>
        <Header loggedInCallback={setUser} />
        <Message404 />;
      </div>
    );
  }

  return (
    <div>
      <Header loggedInCallback={setUser} />
      <div className="profile section">
        <div className="title">My Profile</div>
        <div className="email">{user._id.split(':')[1]}</div>
        <div className="button" onClick={logOut}>Log Out</div>
      </div>
    </div>
  );
}

function logOut() {
  fetch('/api/auth/logout', {
    method: 'DELETE',
  }).then((res) => {
    if (res.status === 200) window.location.href = '/';
  });
}

export default Profile;
