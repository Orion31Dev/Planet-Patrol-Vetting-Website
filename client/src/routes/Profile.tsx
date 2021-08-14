import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import Message404 from '../components/Message404';

function Profile() {
  let [user, setUser]: [any, Function] = useState(null);
  let [answeredTics, setAnsweredTics]: [any[], Function] = useState([]);
  let [unansweredTics, setUnansweredTics]: [any[], Function] = useState([]);

  useEffect(() => {
    getAnsweredTics((data: any) => {
      setAnsweredTics(data.answered);
      setUnansweredTics(data.unanswered.filter((t: any) => t.length < 3));
    });
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
        {unansweredTics.length > 0 && (
          <div className="tic-list">
            <div className="title">These TICs need your attention:</div>
            <div className="tics">{unansweredTics.map((tic) => ticLink(tic.id, false))}</div>
          </div>
        )}
        <div className="tic-list">
          <div className="title">
            {answeredTics.length > 0 ? 'You have responded to these TICs:' : 'You have not responded to any TICs.'}
          </div>
          <div className="tics">{answeredTics.map((tic) => ticLink(tic.id, true))}</div>
        </div>
      </div>
    </div>
  );
}

let index = 0;
function ticLink(ticId: string, answered: boolean) {
  return (
    <a href={`/tic/${ticId}`} key={index++} className={'tic-link' + (answered ? '' : ' unanswered')}>
      {ticId}
    </a>
  );
}

function getAnsweredTics(callback: Function) {
  fetch('/api/answered-tics', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      callback(data);
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
