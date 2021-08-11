import React, { useState } from 'react';
import { useEffect } from 'react';

function Search(props: { inputUpdateCallback?: Function }) {
  let [idVal, setIdVal] = useState('');

  useEffect(() => {
    if (props.inputUpdateCallback) props.inputUpdateCallback(idVal);
  }, [props, idVal]);

  return (
    <div className="search section">
      <div className="title">Find a Target</div>
      <div className="input-wrapper">
        <input
          type="text"
          className="id-search"
          placeholder={'1870990135'}
          value={idVal}
          maxLength={10}
          onChange={(e) => setIdVal(validate(e.target.value))}
        />
        <div className="label">TIC ID</div>
      </div>
      <div className="btn-search" onClick={() => goTo(idVal)}>
        Go
      </div>
    </div>
  );
}

function validate(str: string) {
  return str.replace(/[^0-9()]/g, '');
}

function goTo(id: string) {
  window.location.href = `/tic/${id}`;
}

export default Search;
