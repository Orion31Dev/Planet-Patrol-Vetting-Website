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
      <div className="user-input section">
        <select>
          <option value="FP">FP</option>
          <option value="PC">PC</option>
        </select>
        <div className="input-wrapper">
          <input type="text" />
          <div className="label">Comments</div>
        </div>
        <div className="button">Submit</div>
      </div>
    </div>
  );
}

export default TIC;
