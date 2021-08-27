import React, { useEffect, useState } from 'react';

enum SortDirection {
  ID,
  DISPS,
  GROUP_DISP,
}

export default function Table(props: { query?: string }) {
  let [tics, setTics] = useState([]);
  let [sortDir, setSortDir] = useState(SortDirection.ID);

  useEffect(() => {
    getTics(setTics);
  }, []);

  return (
    <div className="section table">
      <div className="title">TIC Table</div>
      <div className="sort-by">
        <div className="label">Sort By</div>:{' '}
        <span
          className={sortDir === SortDirection.ID ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.ID);
          }}
        >
          ID
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.DISPS ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.DISPS);
          }}
        >
          # Dispositions
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.GROUP_DISP ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.GROUP_DISP);
          }}
        >
          Group Disposition
        </span>
      </div>
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
            <th># Disps</th>
          </tr>
          {sort(tics, sortDir)
            .filter((t: any) => {
              if (props.query) {
                if (
                  props.query.split(', ').every((d) => {
                    if (
                      Object.keys(t.doc.dispositions).some((k) => {
                        return t.doc.dispositions[k].disposition.includes(d) || t.doc.dispositions[k].comments.includes(d);
                      })
                    )
                      return true;
                    return false;
                  })
                )
                  return true;

                if (t.id.replace('tic:', '').includes(props.query)) return true;
                return false;
              } else return true;
            })
            .map((t: any) => createTableRow(t.doc))}
        </tbody>
      </table>
    </div>
  );
}

function sort(arr: any[], sort: SortDirection) {
  switch (sort) {
    case SortDirection.ID:
      return arr.sort((a: any, b: any) => {
        let ia = parseInt(a.id.replace('tic:', ''));
        let ib = parseInt(b.id.replace('tic:', ''));

        return ia > ib ? 1 : -1;
      });
    case SortDirection.DISPS:
      return arr.sort((a: any, b: any) => {
        let ad = Object.keys(a.doc.dispositions).length;
        let bd = Object.keys(b.doc.dispositions).length;

        return ad > bd ? 1 : -1;
      });
    case SortDirection.GROUP_DISP:
      return arr.sort((a: any, b: any) => {
        let ag = a.doc.dispositions['user:group']?.disposition || '';
        let bg = b.doc.dispositions['user:group']?.disposition || '';

        if (ag === bg) {
          let ia = parseInt(a.id.replace('tic:', ''));
          let ib = parseInt(b.id.replace('tic:', ''));

          return ia > ib ? 1 : -1;
        }

        if (ag === '') return 1;
        if (bg === '') return -1;

        return ag > bg ? 1 : -1;
      });
  }
}

function getTics(callback: Function) {
  fetch('/api/all-tics', {
    method: 'GET',
  }).then((d) =>
    d.json().then((d) =>
      callback(
        d.sort((a: any, b: any) => {
          return parseFloat(a.id.split(':')[1].replace('(', '.').replace(')', '')) >
            parseFloat(b.id.split(':')[1].replace('(', '.').replace(')', ''))
            ? 1
            : -1;
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
      <td className="id">
        <a href={'/tic/' + ticId}>{ticId}</a>
      </td>
      <td>
        <a className="gray" target="_blank" rel="noreferrer" href={`https://exofop.ipac.caltech.edu/tess/target.php?id=${ticId}`}>
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
      <td>{Object.keys(tic.dispositions).length}</td>
    </tr>
  );
}
