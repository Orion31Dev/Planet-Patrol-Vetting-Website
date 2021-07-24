import React from 'react';

export default function TicInput() {
  return (
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
  );
}

function submitData(ticId: any, disposition: string, comments: string) {
  fetch('/api/submit/' + ticId, {
    method: 'POST',
    body: JSON.stringify({
      comments: comments,
      disposition: disposition,
    }),
  });
}
