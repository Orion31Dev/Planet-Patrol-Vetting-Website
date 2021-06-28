import React from 'react';
import './styles/style.scss';
import Header from './components/Header';
import Search from './components/Search';

function App() {
  return (
    <div className="app">
      <Header />
      <Search />
    </div>
  );
}

export default App;
