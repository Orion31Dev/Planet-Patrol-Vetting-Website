import React, { useState } from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Table from '../components/Table';

function Unpublished() {
  let [searchVal, setSearchVal] = useState('');

  return (
    <div className="home">
      <Header />
      <div className="title">All Dispositions</div>
      <Search inputUpdateCallback={setSearchVal} />
      <Table query={searchVal} />
    </div>
  );
}

export default Unpublished;
