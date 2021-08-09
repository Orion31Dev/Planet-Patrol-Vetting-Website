import React, { useEffect, useState } from 'react';

export default function Table(props: { query?: string }) {
  let [tics, setTics] = useState([]);

  useEffect(() => {
    getTics(setTics);
  }, []);

  return (
    <div className="section table">
      <div className="title">TIC Table</div>
      <table>
        <tbody>
          <tr className="headers">
            <th>TIC ID</th>
            <th>Exofop</th>
            <th>Sectors</th>
            <th>Epoch [BJD]</th>
            <th>Period [Days]</th>
            <th>Duration [Hrs]</th>
            <th>Depth [ppm]</th>
            <th>Depth [%]</th>
            <th>Rtranister</th>
            <th>RStar</th>
            <th>Tmag</th>
            <th>Δ Tmag</th>
            <th>Group Disposition</th>
            <th>Group Comments</th>
          </tr>
          {tics
            .filter((t: any) => {
              if (props.query) return t.id.replace('tic:', '').includes(props.query);
              else return true;
            })
            .map((t: any) => createTableRow(t.doc))}
        </tbody>
      </table>
    </div>
  );
}

function getTics(callback: Function) {
  fetch('/api/all-tics', {
    method: 'GET',
  }).then((d) =>
    d.json().then((d) =>
      callback(
        d.sort((a: any, b: any) => {
          return parseFloat(a.id.split(':')[1]) > parseFloat(b.id.split(':')[1]) ? 1 : -1;
        })
      )
    )
  );
}

let index = 0;
function createTableRow(tic: any) {
  let ticId = tic._id.split(':')[1];

  let gd = '';
  let gc = '';

  if (tic.dispositions['user:group']) {
    gd = tic.dispositions['user:group'].disposition;
    gc = tic.dispositions['user:group'].comments;
  }

  return (
    <tr key={index++}>
      <td>
        <a href={'/tic/' + ticId}>{ticId}</a>
      </td>
      <td>
        <a className="gray" href={`https://exofop.ipac.caltech.edu/tess/target.php?id=${ticId}`}>
          [Link]
        </a>
      </td>
      <td>{tic.sectors.replace(/,(?=[^\s])/g, ', ') || ''}</td>
      <td>{tic.epoch?.toFixed(2) || ''}</td>
      <td>{tic.period?.toFixed(2) || ''}</td>
      <td>{tic.duration?.toFixed(2) || ''}</td>
      <td>{tic.depth}</td>
      <td>{tic.depthPercent?.toFixed(2) || ''}</td>
      <td>{tic.rTranister?.toFixed(2) || ''}</td>
      <td>{tic.rStar?.toFixed(2) || ''}</td>
      <td>{tic.tmag}</td>
      <td>{tic.deltaTmag}</td>
      <td>{gd}</td>
      <td>{gc}</td>
    </tr>
  );
}
