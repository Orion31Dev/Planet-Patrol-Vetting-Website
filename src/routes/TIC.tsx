import React from 'react';
import { useParams } from 'react-router';
import TICInfo from '../components/TICInfo';
import Header from '../components/Header';

function TIC() {
  let { ticId }: any = useParams();

  return (
    <div className="tic">
      <Header />
      <TICInfo id={ticId} />
    </div>
  );
}

export default TIC;
