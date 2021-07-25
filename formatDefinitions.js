let str = `(p)Vshape == (potential) V-shaped transit
Low SNR == Low Signal-to-Noise Ratio
(p)TD == (potentially) Too Deep, i.e. transit depth suggest a stellar companion instead of a planetary companion
ppm == Parts per Million
FSCP == Field Star in Central Pixel (bright enough to produce transtis, i.e. within Delta Tmag)
FSCPdi == Field Star in Central Pixel EXOFOP Direct imaging (bright enough to produce transtis, i.e. within Delta Tmag)
SPC == SIMBAD Planet Candidate
SCP == SIMBAD Confirmed Planet
OED == Odd Even differs
TCP == Tresca Confirmed Planet
EB == Eclipsing Binary
SB ==  Spectroscopic Binary 
pTD == (potentially) Too deep
BEER == BEaming, Ellipsoidal, Reflection binary star
HPMS == High Proper Motion Star 
Fla == Flare
NT == No Transit
TFP == Too Few Points
SPR == Shallow: Potentially Rocky PC
MD == Momentum Dump(s)
Rp == Radius of Planet
Rs == Radius of Sun
UC == Unreliable Centroids
short-P == Short Period
pOcc == Potential Occultation
run-2min == Missing 2-min PDF
WE == Wrong ephemerides (transit does not occurr at predicted times)
HJ == Hot Jupiter 
MSD == Misleading data (lightcurve, modshift, centroid)
AT == Additional transits
FSOP == Field Star in Other Pixel (A star within the Delta Tmag, but outside the central pixel)
`;

str.split('\n').forEach((s) => {
  let spl = s.split(' == ');
  console.log(`{ name: '${spl[0]}', def: '${spl[1]}'},`);
});
