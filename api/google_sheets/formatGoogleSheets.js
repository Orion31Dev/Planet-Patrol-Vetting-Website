// TIC ID,ExoFOP-TESS,Sectors,Epoch,Period,Duration,Depth,Depth,Rtranister,Rstar,Tmag,Delta Tmag,Group Disposition,Reason for Group Disposition,Group Comments,Disposition (VK),Comments (VK),Disposition (LC),Comments (LC),Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
// 0            1        2      3     4       5       6     7      8         9    10      11            12                     13                    14             15              16             17              18             19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36

require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let str = `1003831	https://exofop.ipac.caltech.edu/tess/target.php?id=1003831	8	2458518.203	1.651142	0.76	3007	0.30	0.49	0.98	10.6701	6.30				PC	pVshape			CP (exofop)	SPC, our pdf graph looks off in the scale	CP	TOI-564 b			PC										CP	TOI-564 b `;

function format(line) {
  let spl = line.split('\t');
  let dispositions = {};

  if (spl[12]) {
    dispositions['user:group'] = {
      disposition: spl[12],
      comments: spl[13] || '',
    };
  }

  if (spl[15]) {
    dispositions['user:veselin.b.kostov@gmail.com'] = {
      disposition: spl[15],
      comments: spl[16] || '',
    };
  }

  if (spl[17]) {
    dispositions['user:lucacacciapuoti.lc@gmail.com'] = {
      disposition: spl[17],
      comments: spl[18] || '',
    };
  }

  if (spl[19]) {
    dispositions['user:dclaymore@gmail.com'] = {
      disposition: spl[19],
      comments: spl[20] || '',
    };
  }

  if (spl[21]) {
    dispositions['user:marco.z.difraia@gmail.com'] = {
      disposition: spl[21],
      comments: spl[22] || '',
    };
  }

  if (spl[23]) {
    dispositions['user:julien.delambilly@gmail.com'] = {
      disposition: spl[23],
      comments: spl[24] || '',
    };
  }

  if (spl[25]) {
    dispositions['user:john.yablonsky29@gmail.com'] = {
      disposition: spl[25],
      comments: spl[26] || '',
    };
  }

  if (spl[27]) {
    dispositions['user:alineuemura@gmail.com'] = {
      disposition: spl[27],
      comments: spl[28] || '',
    };
  }

  if (spl[29]) {
    dispositions['user:marc.andres.carcasona@gmail.com'] = {
      disposition: spl[29],
      comments: spl[30] || '',
    };
  }

  if (spl[31]) {
    dispositions['user:riccardo'] = {
      disposition: spl[31],
      comments: spl[32] || '',
    };
  }

  if (spl[33]) {
    dispositions['user:francesco'] = {
      disposition: spl[33],
      comments: spl[34] || '',
    };
  }

  if (spl[35]) {
    dispositions['user:michiharu.hyogo77@gmail.com'] = {
      disposition: spl[36],
      comments: spl[37] || '',
    };
  }

  return {
    _id: `tic:${spl[0]}`,
    sectors: `${spl[2].replace('"', '')}`,
    epoch: parseFloat(spl[3]),
    period: parseFloat(spl[4]),
    duration: parseFloat(spl[5]),
    depth: parseFloat(spl[6]),
    depthPercent: parseFloat(spl[7]),
    rTranister: parseFloat(spl[8]),
    rStar: parseFloat(spl[9]),
    tmag: parseFloat(spl[10]),
    deltaTmag: parseFloat(spl[11]),
    dispositions: dispositions,
  };
}

//db.insert(format(str))

async function processLineByLine() {
  const fileStream = fs.createReadStream('./api/google_sheets/table.tsv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let firstLine = true;
  for await (const line of rl) {
    if (firstLine) {
      firstLine = false;
      continue;
    }
    // Each line in input.txt will be successively available here as `line`.
    //console.log(format(line).dispositions);
    db.insert(format(line));

    // Sleep
    await new Promise((r) => setTimeout(r, 1000));
  }
}

processLineByLine();
console.log(format(str));
