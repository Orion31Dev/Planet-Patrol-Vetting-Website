import React from 'react';
import './styles/style.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Unpublished from './routes/Unpublished';
import Tic from './routes/Tic';
import Profile from './routes/Profile';
import Dictionary from './routes/Dictionary';
import Published from './routes/Published';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/tic/:ticId" component={Tic} />
          <Route path="/ptic/:ticId">
            <Tic paper />
          </Route>
          <Route path="/profile" component={Profile} />
          <Route path="/dictionary" component={Dictionary} />
          <Route path="/unpublished" component={Unpublished} />
          <Route path="/" component={Published} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
