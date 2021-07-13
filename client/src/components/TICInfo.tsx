import React from 'react';

function TICInfo(props: { id: any }) {
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
          <div className="num">2458518.203</div>
        </div>
        <div className="stat">
          <div className="label">
            Period <span>[Days]</span>
          </div>
          <div className="num">1.651142</div>
        </div>
        <div className="stat">
          <div className="label">
            Duration <span>[Hours]</span>
          </div>
          <div className="num">0.76</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[ppm]</span>
          </div>
          <div className="num">3007</div>
        </div>
        <div className="stat">
          <div className="label">
            Depth <span>[%]</span>
          </div>
          <div className="num">0.30</div>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">Sector(s)</div>
          <div className="num">8</div>
        </div>
        <div className="stat">
          <div className="label">
            RStar <span>[RSun]</span>
          </div>
          <div className="num">0.98</div>
        </div>
        <div className="stat">
          <div className="label">
            RTransitor <span>[RJupiter]</span>
          </div>
          <div className="num">0.49</div>
        </div>
        <div className="stat">
          <div className="label">Tmag</div>
          <div className="num">10.6701</div>
        </div>
        <div className="stat up">
          <div className="label">
            Delta Tmag <br />
            <span>[Nearby Sources]</span>
          </div>
          <div className="num">6.30</div>
        </div>
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
            <tr>
              <td>Veselin Kostov</td>
              <td>PC</td>
              <td>pVshape</td>
            </tr>
            <tr>
              <td>Ryan Salik</td>
              <td>FP</td>
              <td>CO, low SNR, pSS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TICInfo;
