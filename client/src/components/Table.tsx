import React, { useEffect, useState } from 'react';

enum SortDirection {
  ID,
  DISPS,
  PERIOD,
  RADIUS_PLANET,
  RADIUS_STAR,
  PAPER_DISP,
}

export default function Table(props: { query?: string; paper?: boolean }) {
  let [tics, setTics] = useState([]);
  let [fail, setFail] = useState(false);
  let [sortDir, setSortDir] = useState(SortDirection.ID);

  useEffect(() => {
    getTics((d: any) => {
      setTics(d);
      if (d.length < 1) setFail(true);
    });
  }, []);

  if (fail) return getFailMessage();

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
          # Dispositions Dsc.
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.PERIOD ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.PERIOD);
          }}
        >
          Period
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.RADIUS_PLANET ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.RADIUS_PLANET);
          }}
        >
          Rtransiter
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.RADIUS_STAR ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.RADIUS_STAR);
          }}
        >
          Rstar
        </span>{' '}
        |{' '}
        <span
          className={sortDir === SortDirection.PAPER_DISP ? 'selected' : ''}
          onClick={() => {
            setSortDir(SortDirection.PAPER_DISP);
          }}
        >
          Paper Disposition
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
            <th>Rtransiter</th>
            <th>RStar</th>
            <th>Tmag</th>
            <th>Δ Tmag</th>
            <th>Paper Disposition</th>
            <th>Paper Comments</th>
            <th># Disps</th>
          </tr>
          {sort(tics, sortDir, props.paper)
            .filter((t: any) => {
              if (props.paper && !t.doc.dispositions['user:paper']) {
                return false;
              }

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
            .map((t: any) => createTableRow(t.doc, props.paper))}
        </tbody>
      </table>
    </div>
  );
}

function sort(arr: any[], sort: SortDirection, paper?: boolean) {
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
    case SortDirection.PERIOD:
      return arr.sort((a: any, b: any) => {
        let ap = a.doc.period;
        let bp = b.doc.period;

        return ap > bp ? 1 : -1;
      });
    case SortDirection.RADIUS_PLANET:
      return arr.sort((a: any, b: any) => {
        let ap = a.doc.rTranister;
        let bp = b.doc.rTranister;

        return ap > bp ? 1 : -1;
      });
    case SortDirection.RADIUS_STAR:
      return arr.sort((a: any, b: any) => {
        let ap = a.doc.rStar;
        let bp = b.doc.rStar;

        return ap > bp ? 1 : -1;
      });
    case SortDirection.PAPER_DISP:
      return arr.sort((a: any, b: any) => {
        let ag = a.doc.dispositions['user:paper']?.disposition || '';
        let bg = b.doc.dispositions['user:paper']?.disposition || '';

        // For published dispositions, CP Paper dispositions should be replaced by PC.
        if (paper) {
          if (ag === 'CP') ag = 'PC';
          if (bg === 'CP') bg = 'PC';
        }

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
    d.json().then((d) => {
      callback(
        d.sort((a: any, b: any) => {
          return parseFloat(a.id.split(':')[1].replace('(', '.').replace(')', '')) >
            parseFloat(b.id.split(':')[1].replace('(', '.').replace(')', ''))
            ? 1
            : -1;
        })
      );
    })
  );
}

let index = 0;
function createTableRow(tic: any, paper?: boolean) {
  let ticId = tic._id.split(':')[1];

  let pd = '';
  let pc = '';

  if (tic.dispositions['user:paper']) {
    pd = tic.dispositions['user:paper'].disposition;
    pc = tic.dispositions['user:paper'].comments;

    // For published dispositions, CP Paper dispositions should be replaced by PC.
    if (paper && pd === 'CP') pd = 'PC';
  }

  let link = paper ? `/ptic/${ticId}` : `/tic/${ticId}`;

  return (
    <tr key={index++}>
      <td className="id">
        <a href={link}>{ticId}</a>
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
      <td>{pd}</td>
      <td>{pc}</td>
      <td>{Object.keys(tic.dispositions).length}</td>
    </tr>
  );
}

function getFailMessage() {
  return (
    <div className="section table fail">
      <div className="title">Failed to load TICs.</div>
      <div className="msg">Try waiting for a few seconds and refreshing the page.</div>
      <div className="msg">
        If this problem persists, contact&nbsp;
        <a target="_blank" rel="noreferrer" href="mailto:planetpatrolweb@gmail.com">
          the developers
        </a>
        .
      </div>
    </div>
  );
}
