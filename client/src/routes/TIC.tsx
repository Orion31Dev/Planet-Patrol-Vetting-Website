import React, { useState } from 'react';
import { useParams } from 'react-router';
import TicInfo, { TicData } from '../components/TicInfo';
import Header from '../components/Header';
import Message404 from '../components/Message404';
import { useEffect } from 'react';
import TicInput from '../components/TicInput';

const emptyTICData = {} as TicData;

function Tic() {
  let { ticId }: any = useParams();
  let [is404, setIs404] = useState(false);
  let [ticData, setTicData] = useState(emptyTICData);

  useEffect(() => {
    getTicData(ticId, setIs404, setTicData);
  }, [ticId]);

  if (is404)
    return (
      <div className="tic">
        <Header />
        <Message404 />
      </div>
    );

  return (
    <div className="tic">
      <Header />
      <TicInfo id={ticId} data={ticData} />
      <TicInput id={ticId} />
    </div>
  );
}

function getTicData(ticId: string, setIs404: Function, setTicData: Function) {
  fetch(`/api/tic/${ticId}`, {
    method: 'GET',
  }).then((res) => {
    if (res.status === 404) setIs404(true);
    else res.json().then((data) => setTicData(data as TicData));
  });
}

export default Tic;
