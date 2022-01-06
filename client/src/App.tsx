import React from 'react';
import './styles/style.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './routes/Home';
import Tic from './routes/Tic';
import Profile from './routes/Profile';
import Dictionary from './routes/Dictionary';
import Paper from './routes/Paper';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/tic/:ticId" component={Tic} />
          <Route path="/profile" component={Profile} />
          <Route path="/dictionary" component={Dictionary} />
          <Route path="/paper" component={Paper} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
