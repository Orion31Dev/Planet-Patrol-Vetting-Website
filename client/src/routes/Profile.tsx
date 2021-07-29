import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import Message404 from '../components/Message404';

function Profile() {
  let [user, setUser]: [any, Function] = useState(null);
  let [unansweredTics, setUnansweredTics] = useState([]);

  useEffect(() => {
    getUnansweredTics(setUnansweredTics);
  }, []);

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
        <div className="button" onClick={logOut}>
          Log Out
        </div>
        <div className="need-attention">
          <div className="title">{unansweredTics.length > 0 ? "These TICs need your attention:" : "You have commented on all TICs"}</div>
          <div className="tics">{unansweredTics.map(ticLink)}</div>
        </div>
      </div>
    </div>
  );
}

let index = 0;
function ticLink(ticId: string) {
  return (
    <a href={`/tic/${ticId}`} key={index++} className="tic-link">
      {ticId}
    </a>
  );
}

function getUnansweredTics(callback: Function) {
  fetch('/api/unanswered-tics', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      callback(data.list);
    });
}

function logOut() {
  fetch('/api/auth/logout', {
    method: 'DELETE',
  }).then((res) => {
    if (res.status === 200) window.location.href = '/';
  });
}

export default Profile;
