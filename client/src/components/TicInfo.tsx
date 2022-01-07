import React, { useState, useEffect } from 'react';

export type TicData = {
  exofopLink: string;
  epoch: number;
  period: number;
  duration: number;
  depth: number;
  depthPercent: number;
  sectors: string;
  rTranister: number;
  rStar: number;
  tmag: number;
  deltaTmag: number;
  dispositions: Disposition[];
};

export type Disposition = {
  _id: string;
  name: string;
  disposition: string;
  comments: string;
};

function TicInfo(props: { id: any; data: TicData; paper?: boolean }) {
  let [files, setFiles]: [any[], Function] = useState([]);
  let [filesWaiting, setFilesWaiting] = useState(true);
  let [showFiles, setShowFiles] = useState(true);

  useEffect(() => {
    getFiles(props.id, (data: any) => {
      setFiles(data);
      setFilesWaiting(false);
    });
  }, [props.id]);

  let nullText = <span className="null">null</span>;

  return (
    <div className="tic-info section">
      <div className="title">
        TIC <div className="id">{props.id}</div>
      </div>
      <div className="exofop">
        <a target="_blank" rel="noreferrer" href={'https://exofop.ipac.caltech.edu/tess/target.php?id=' + props.id}>
          [Exofop Link]
        </a>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">
            Epoch <span>[BJD]</span>
          </div>
          <div className="num">{props.data.epoch || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            Period <span>[Days]</span>
          </div>
          <div className="num">{props.data.period || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            Duration <span>[Hours]</span>
          </div>
          <div className="num">{props.data.duration?.toFixed(2) || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[ppm]</span>
          </div>
          <div className="num">{props.data.depth || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[%]</span>
          </div>
          <div className="num">{props.data.depthPercent?.toFixed(2) || nullText}</div>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">Sector(s)</div>
          <div className="num">{props.data.sectors || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            RStar <span>[RSun]</span>
          </div>
          <div className="num">{props.data.rStar?.toFixed(2) || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">
            RTranister <span>[RJupiter]</span>
          </div>
          <div className="num">{props.data.rTranister?.toFixed(2) || nullText}</div>
        </div>
        <div className="stat">
          <div className="label">Tmag</div>
          <div className="num">{props.data.tmag || nullText}</div>
        </div>
        <div className="stat up">
          <div className="label">
            Delta Tmag <br />
            <span>Nearby Sources</span>
          </div>
          <div className="num">{props.data.deltaTmag?.toFixed(2) || nullText}</div>
        </div>
      </div>
      {filesWaiting ? (
        <div className="files-waiting">Searching for Files...</div>
      ) : (
        <div className="files">
          <div className="title">
            Files <span onClick={() => setShowFiles(!showFiles)}>[{showFiles ? 'Collapse' : 'Expand'}]</span>
          </div>
          <table>
            <tbody>
              <tr className="headers">
                <th>Name</th>
                <th>Links</th>
              </tr>
              {showFiles && generateFileRows(files)}
            </tbody>
          </table>
        </div>
      )}
      <div className="dispositions">
        <div className="title">Disposition Table</div>
        <table>
          <tbody>
            <tr className="headers">
              <th>Name</th>
              <th>Disposition</th>
              <th>Comments</th>
            </tr>
            {generateDispositionRows(props.data.dispositions, props.paper)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function generateFileRows(files: any[]) {
  if (!files.length) return [];

  let key = 0;
  return files.map((p) => {
    return (
      <tr key={key++}>
        <td>{p.name}</td>
        <td>
          <a target="_blank" rel="noreferrer" href={p.webContentLink.replace('&export=download', '')}>
            [Link]
          </a>
        </td>
      </tr>
    );
  });
}

function generateDispositionRows(dispositions: Disposition[], paper?: boolean) {
  if (!dispositions) return [];

  let key = 0;
  return dispositions.map((d) => {
    // Public Dispositions should say PC instead of CP.
    if (d._id === 'user:group' && paper) return <React.Fragment></React.Fragment>;

    let disposition = paper ? d.disposition.replace('CP', 'PC') : d.disposition;

    return (
      <tr key={key++} className={(d._id === 'user:group' ? 'group' : '') + (d._id === 'user:paper' ? 'paper' : '')}>
        <td>{d.name}</td>
        <td>{disposition}</td>
        <td>{d.comments}</td>
      </tr>
    );
  });
}

function getFiles(ticId: any, callback: Function) {
  ticId = ticId.replace(/\(([^)]+)\)/gm, ''); // Remove "(2)" etc from multiplanetary systems
  fetch('/api/files/' + ticId, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => callback(data));
}

export default TicInfo;
