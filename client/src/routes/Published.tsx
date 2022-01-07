import React, { useState } from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Table from '../components/Table';

export default function Published() {
  let [searchVal, setSearchVal] = useState("");
  
  return (
    <div className="paper">
      <Header />
      <div className="title">Published Dispositions</div>
      <Search inputUpdateCallback={setSearchVal} />
      <Table query={searchVal} paper />
    </div>
  );
}