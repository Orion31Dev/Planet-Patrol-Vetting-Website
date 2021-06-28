import React, { useState } from 'react';

function Header() {
  let [idVal, setIdVal] = useState('');

  return (
    <div className="search section">
      <div className="section-title">Find a Target</div>
      <div className="input-wrapper">
        <input
          type="text"
          className="id-search"
          placeholder={'0000000'}
          value={idVal}
          maxLength={7}
          onChange={(e) => setIdVal(validate(e.target.value))}
        />
        <div className="label">TIC ID</div>
      </div>
      <div className="btn-search">Find</div>
    </div>
  );
}

function validate(str: string) {
  return str.replace(/\D/g, '');
}

export default Header;
