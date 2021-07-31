import React, { useState, useEffect } from 'react';
//import PDF from './PDF';

export type TicData = {
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
  name: string;
  disposition: string;
  comments: string;
};

function TicInfo(props: { id: any; data: TicData }) {
  let [pdfs, setPDFs]: [any[], Function] = useState([]);
  let [showPDFs, setShowPDFs] = useState(true);

  useEffect(() => {
    getPDFs(props.id, setPDFs);
  }, [props.id]);

  return (
    <div className="tic-info section">
      <div className="title">
        TIC <div className="id">{props.id}</div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">
            Epoch <span>[BJD]</span>
          </div>
          <div className="num">{props.data.epoch}</div>
        </div>
        <div className="stat">
          <div className="label">
            Period <span>[Days]</span>
          </div>
          <div className="num">{props.data.period}</div>
        </div>
        <div className="stat">
          <div className="label">
            Duration <span>[Hours]</span>
          </div>
          <div className="num">{props.data.duration?.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[ppm]</span>
          </div>
          <div className="num">{props.data.depth}</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[%]</span>
          </div>
          <div className="num">{props.data.depthPercent?.toFixed(2)}</div>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">Sector(s)</div>
          <div className="num">{props.data.sectors}</div>
        </div>
        <div className="stat">
          <div className="label">
            RStar <span>[RSun]</span>
          </div>
          <div className="num">{props.data.rStar?.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="label">
            RTranister <span>[RJupiter]</span>
          </div>
          <div className="num">{props.data.rTranister?.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="label">Tmag</div>
          <div className="num">{props.data.tmag}</div>
        </div>
        <div className="stat up">
          <div className="label">
            Delta Tmag <br />
            <span>Nearby Sources</span>
          </div>
          <div className="num">{props.data.deltaTmag?.toFixed(2)}</div>
        </div>
      </div>
      <div className="pdfs">
        <div className="title">PDFs <span onClick={() => setShowPDFs(!showPDFs)}>[{showPDFs ? 'Collapse' : 'Expand'}]</span></div>
        <table>
          <tbody>
            <tr className="headers">
              <th>Name</th>
              <th>Links</th>
            </tr>
            {showPDFs && generatePDFs(pdfs)}
          </tbody>
        </table>
      </div>
      <div className="dispositions">
        <div className="title">Disposition Table</div>
        <table>
          <tbody>
            <tr className="headers">
              <th>Name</th>
              <th>Disposition</th>
              <th>Comments</th>
            </tr>
            {generateDispositions(props.data.dispositions)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//         {pdfs.map((pdf) => embeddedPdf(pdf.webContentLink))}

/*
TOI 3277 - TIC 319568619  
TOI 3286 - TIC 113648563  Already vetted
TOI 3504 - TIC 117689799 
TOI 3514 - TIC 1870990135 
TOI 3595 - TIC 440113053
TOI 3604 - TIC 330135981 
TOI 3612 - TIC 233948455 
TOI 3693 - TIC 240823272 
TOI 3922 - TIC 1101855081 
TOI 3937 - TIC 367425982 
TOI 4059 - TIC 229605891 
TOI 4145 - TIC 279947414  
*/
//function embeddedPdf(link: string) {
 // return <PDF url={link.replace('&export=download', '')} />;
//}

function generatePDFs(pdfs: any[]) {
  if (!pdfs.length) return[];

  let key = 0;
  return pdfs.map((p) => {
    return (
      <tr key={key++}>
        <td>{p.name}</td>
        <td><a target="_blank" rel="noreferrer" href={p.webContentLink.replace('&export=download', '')}>[Link]</a></td>
      </tr>
    );
  });
}

function generateDispositions(dispositions: Disposition[]) {
  if (!dispositions) return [];

  let key = 0;
  return dispositions.map((d) => {
    return (
      <tr key={key++}>
        <td>{d.name}</td>
        <td>{d.disposition}</td>
        <td>{d.comments}</td>
      </tr>
    );
  });
}

function getPDFs(ticId: any, callback: Function) {
  fetch('/api/pdfs/' + ticId, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => callback(data));
}

export default TicInfo;
