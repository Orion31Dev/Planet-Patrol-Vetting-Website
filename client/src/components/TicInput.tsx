import React from 'react';
import { useState, useRef } from 'react';

const quickFillVals = ['pVshape', 'SS', 'TD', 'CO', 'Low SNR', 'FSCP', 'SPC', 'SCP',
'OED', 'TCP', 'EB', 'SB', 'BEER', 'HPMS', 'Fla', 'NT', 'TFP', 'SPR', 'MD', 'UC', 'short-P',
'pOcc', 'run-2min', 'WE', 'HJ', 'MSD', 'AT', 'FSOP'].sort();

export default function TicInput(props: { id: any; updateFunction: Function; user: any }) {
  let [disposition, setDisposition] = useState('FP');
  let [comments, setComments] = useState('');

  const commentsRef = useRef<HTMLInputElement>(null);

  return (
    <div className="section user-input">
      <div className="no-wrap">
        <select onChange={(e) => setDisposition(e.target.value)} value={disposition}>
          <option value="FP">FP</option>
          <option value="pFP">pFP</option>
          <option value="PC">PC</option>
          <option value="CP">CP</option>
        </select>
        <div className="input-wrapper">
          <input type="text" ref={commentsRef} onChange={(e) => setComments(e.target.value)} value={comments} />
          <div className="label">Comments</div>
        </div>
        <div className="button" onClick={() => submitData(props.id, disposition, comments, props.updateFunction, false)}>
          Submit
        </div>
        {props.user.group && (
          <div className="button group" onClick={() => submitData(props.id, disposition, comments, props.updateFunction, true)}>
            Submit as Group
          </div>
        )}
      </div>
      <table className="quick-fills"><tbody>{generateQuickFills(comments, setComments, commentsRef)}</tbody></table>
    </div>
  );
}

function generateQuickFills(val: string, setValue: Function, commentsRef: any) {
  let elementArr = [];

  let index = 0;

  while (index < quickFillVals.length) {
    let colspan = 1;
    if (!quickFillVals[index + 1]) colspan = 4;
    else if (!quickFillVals[index + 2]) colspan = 2;
    else if (!quickFillVals[index + 3]) colspan = 2;

    elementArr.push(
      <tr key={index}>
        {generateQuickFill(quickFillVals[index], val, setValue, commentsRef, (quickFillVals[index + 2] && colspan === 2) ? 1 : colspan)}
        {quickFillVals[index + 1] && generateQuickFill(quickFillVals[index + 1], val, setValue, commentsRef, (quickFillVals[index + 2] && colspan === 2) ? 1 : colspan)}
        {quickFillVals[index + 2] && generateQuickFill(quickFillVals[index + 2], val, setValue, commentsRef, colspan)}
        {quickFillVals[index + 3] && generateQuickFill(quickFillVals[index + 3], val, setValue, commentsRef)}
      </tr>
    );

    index += 4;
  }

  return elementArr;
}

function generateQuickFill(fill: string, val: string, setValue: Function, ref: any, colspan: number = 1) {
  return (
    <td
      className="quick-fill"
      key={fill}
      onClick={() => {
        setValue(val + fill + ', ');
        ref.current?.focus();
      }}
      colSpan={colspan}
    >
      {fill}
    </td>
  );
}

function submitData(ticId: any, disposition: string, comments: string, updateFunction: Function, group: boolean) {
  fetch('/api/submit/' + ticId, {
    method: 'POST',
    body: JSON.stringify({
      comments: comments,
      disposition: disposition,
      group: group,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.status === 200) updateFunction();
  });
}
