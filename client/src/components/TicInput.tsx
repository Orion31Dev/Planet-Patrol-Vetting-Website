import React from 'react';
import { useState } from 'react';

export default function TicInput(props: { id: any }) {
  let [disposition, setDisposition] = useState('FP');
  let [comments, setComments] = useState('');

  return (
    <div className="user-input section">
      <select onChange={(e) => setDisposition(e.target.value)} value={disposition}>
        <option value="FP">FP</option>
        <option value="PC">PC</option>
      </select>
      <div className="input-wrapper">
        <input type="text" onChange={(e) => setComments(e.target.value)} value={comments} />
        <div className="label">Comments</div>
      </div>
      <div className="button" onClick={() => submitData(props.id, disposition, comments)}>
        Submit
      </div>
    </div>
  );
}

function submitData(ticId: any, disposition: string, comments: string) {
  fetch('/api/submit/' + ticId, {
    method: 'POST',
    body: JSON.stringify({
      comments: comments,
      disposition: disposition,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
