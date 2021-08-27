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
          placeholder={'pVshape, BEER'}
          value={idVal}
          maxLength={20}
          onChange={(e) => setIdVal(validate(e.target.value))}
        />
        <div className="label">TIC ID / Dispositions</div>
      </div>
    </div>
  );
}

function validate(str: string) {
  return str;
  //return str.replace(/[^0-9()]/g, '');
}
export default Search;
