import React from 'react';
import { useState } from 'react';

export default function TicInput(props: { id: any, updateFunction: Function }) {
  let [disposition, setDisposition] = useState('FP');
  let [comments, setComments] = useState('');

  return (
    <div className="user-input section">
      <select onChange={(e) => setDisposition(e.target.value)} value={disposition}>
        <option value="FP">FP</option>
        <option value="pFP">pFP</option>
        <option value="PC">PC</option>
        <option value="CP">CP</option>
      </select>
      <div className="input-wrapper">
        <input type="text" onChange={(e) => setComments(e.target.value)} value={comments} />
        <div className="label">Comments</div>
      </div>
      <div className="button" onClick={() => submitData(props.id, disposition, comments, props.updateFunction)}>
        Submit
      </div>
    </div>
  );
}

function submitData(ticId: any, disposition: string, comments: string, updateFunction: Function) {
  fetch('/api/submit/' + ticId, {
    method: 'POST',
    body: JSON.stringify({
      comments: comments,
      disposition: disposition,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    if (res.status === 200) updateFunction();
  });
}
