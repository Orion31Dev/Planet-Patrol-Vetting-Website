import React from 'react';
import './styles/style.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './routes/Home';
import TIC from './routes/TIC';
import Profile from './routes/Profile';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/tic/:ticId" component={TIC} />
          <Route path="/profile" component={Profile} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
