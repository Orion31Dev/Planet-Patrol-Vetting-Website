import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';

const definitions = [
  { name: 'LCMOD', def: 'Light Curve Modulation' },
  { name: '(p)SS', def: '(Potential) Significant Secondary eclipse' },
  { name: '(p)FP', def: '(Potential) False Positive' },
  { name: 'CP', def: 'Confirmed _lanet' },
  { name: 'PC', def: 'Planet Candidate' },
  { name: '(p)CO', def: '(Potential) Centroid Offset' },
  { name: '(p)Vshape', def: '(Potential) V-shaped transit' },
  { name: 'Low SNR', def: 'Low Signal-to-Noise Ratio' },
  { name: '(p)TD', def: '(potentially) Too Deep, i.e. transit depth suggest a stellar companion instead of a planetary companion' },
  { name: 'ppm', def: 'Parts per Million' },
  { name: 'FSCP', def: 'Field Star in Central Pixel (bright enough to produce transtis, i.e. within Delta Tmag)' },
  { name: 'FSCPdi', def: 'Field Star in Central Pixel EXOFOP Direct imaging (bright enough to produce transtis, i.e. within Delta Tmag)' },
  { name: 'SPC', def: 'SIMBAD Planet Candidate' },
  { name: 'SCP', def: 'SIMBAD Confirmed Planet' },
  { name: 'OED', def: 'Odd Even differs' },
  { name: 'TCP', def: 'Tresca Confirmed Planet' },
  { name: 'EB', def: 'Eclipsing Binary' },
  { name: 'SB', def: ' Spectroscopic Binary ' },
  { name: '(p)TD', def: '(potentially) Too deep' },
  { name: 'BEER', def: 'BEaming, Ellipsoidal, Reflection binary star' },
  { name: 'HPMS', def: 'High Proper Motion Star ' },
  { name: 'Fla', def: 'Flare' },
  { name: 'NT', def: 'No Transit' },
  { name: 'TFP', def: 'Too Few Points' },
  { name: 'SPR', def: 'Shallow: Potentially Rocky PC' },
  { name: 'MD', def: 'Momentum Dump(s)' },
  { name: 'Rp', def: 'Radius of Planet' },
  { name: 'Rs', def: 'Radius of Sun' },
  { name: 'UC', def: 'Unreliable Centroids' },
  { name: 'short-P', def: 'Short Period' },
  { name: '(p)Occ', def: 'Potential Occultation' },
  { name: 'run-2min', def: 'Missing 2-min PDF' },
  { name: 'WE', def: 'Wrong ephemerides (transit does not occurr at predicted times)' },
  { name: 'HJ', def: 'Hot Jupiter ' },
  { name: 'MSD', def: 'Misleading data (lightcurve, modshift, centroid)' },
  { name: 'AT', def: 'Additional transits' },
  { name: 'FSOP', def: 'Field Star in Other Pixel (A star within the Delta Tmag, but outside the central pixel)' },
];

export default function Dictionary() {
  const [sVal, setSVal] = useState('');

  return (
    <div className="dict-page">
      <Header />
      <div className="section dictionary">
        <div className="title">Definitions and Abbreviations</div>
        <div className="basis-100">
          <div className="input-wrapper">
            <input type="text" className="id-search" placeholder={"SNR"} value={sVal} maxLength={7} onChange={(e) => setSVal(e.target.value)} />
            <div className="label">Search</div>
          </div>
        </div>
        {definitions
          .sort((a, b) => (a.name.replace('(p)', '') > b.name.replace('(p)', '') ? 1 : -1))
          .filter((e) => e.name.toLowerCase().includes(sVal.toLowerCase()))
          .map(Definition)}
      </div>
    </div>
  );
}

let key = 0;
function Definition(obj: { name: string; def: string }) {
  return (
    <div className="term" key={key++}>
      {obj.name} <span className="definition">{obj.def}</span>
    </div>
  );
}
