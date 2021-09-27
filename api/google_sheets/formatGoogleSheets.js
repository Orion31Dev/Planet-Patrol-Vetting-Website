// TIC ID,ExoFOP-TESS,Sectors,Epoch,Period,Duration,Depth,Depth,Rtranister,Rstar,Tmag,Delta Tmag,Group Disposition,Reason for Group Disposition,Group Comments,Disposition (VK),Comments (VK),Disposition (LC),Comments (LC),Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
// 0            1        2      3     4       5       6     7      8         9    10      11            12                     13                    14             15              16             17              18             19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36

require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

const gs = require('./googleSheets');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let str = `1003831	https://exofop.ipac.caltech.edu/tess/target.php?id=1003831	8	2458518.203	1.651142	0.76	3007	0.30	0.49	0.98	10.6701	6.30				PC	pVshape			CP (exofop)	SPC, our pdf graph looks off in the scale	CP	TOI-564 b			PC										CP	TOI-564 b `;

let ids = {};

let ticList = [];
async function getTicList() {
  let pList = await db.partitionedList('tic');
  ticList = pList.rows;

  while (ticList.length < pList.total_rows) {
    pList = await db.partitionedList('tic', { startkey: `${ticList[ticList.length - 1].id}\0` });
    ticList = ticList.concat(pList.rows);
  }

  console.log("Fetched TICs");
}


function format(line) {
  let spl = line.split('\t');
  let dispositions = {};

  if (spl[12]) {
    dispositions['user:paper'] = {
      disposition: spl[12],
      comments: spl[13] || '',
    };
  }

 if (spl[14]) {
    dispositions['user:group'] = {
      disposition: spl[14],
      comments: spl[15] || '',
    };
  }


  // Website
  if (spl[17]) {
    dispositions['user:veselin.b.kostov@gmail.com'] = {
      disposition: spl[17],
      comments: spl[18] || '',
    };
  }

  if (spl[19]) {
    dispositions['user:lucacacciapuoti.lc@gmail.com'] = {
      disposition: spl[19],
      comments: spl[20] || '',
    };
  }

  // Website
  if (spl[21]) {
    dispositions['user:dclaymore@gmail.com'] = {
      disposition: spl[21],
      comments: spl[22] || '',
    };
  }


  // Website
  if (spl[23]) {
    dispositions['user:marco.z.difraia@gmail.com'] = {
      disposition: spl[23],
      comments: spl[24] || '',
    };
  }

  if (spl[25]) {
    dispositions['user:julien.delambilly@gmail.com'] = {
      disposition: spl[25],
      comments: spl[26] || '',
    };
  }

  if (spl[27]) {
    dispositions['user:john.yablonsky29@gmail.com'] = {
      disposition: spl[27],
      comments: spl[28] || '',
    };
  }

  // Website
  if (spl[29]) {
    dispositions['user:alineuemura@gmail.com'] = {
      disposition: spl[29],
      comments: spl[30] || '',
    };
  }

  // Website
  if (spl[31]) {
    dispositions['user:marc.andres.carcasona@gmail.com'] = {
      disposition: spl[31],
      comments: spl[32] || '',
    };
  }

  if (spl[33]) {
    dispositions['user:riccardo'] = {
      disposition: spl[33],
      comments: spl[34] || '',
    };
  }

  if (spl[35]) {
    dispositions['user:francesco'] = {
      disposition: spl[35],
      comments: spl[36] || '',
    };
  }

  if (spl[37]) {
    dispositions['user:michiharu.hyogo77@gmail.com'] = {
      disposition: spl[37],
      comments: spl[38] || '',
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

  let firstLine = true;
  for await (const line of rl) {
    if (firstLine) {
      firstLine = false;
      continue;
    }

    let fmt = format(line);
    
    if (ids[fmt._id]) {
      fmt._id += `(${ids[fmt._id]++})`;
    } else {
      ids[fmt._id] = 2;
    }
    
    if (ticList.some(t => t.id === fmt._id)) {
      continue;
    }

    console.log('Inserting ' + fmt._id);

    try {
      await db.insert(fmt);
    } catch {
      console.log('Failed.');
    }

    // Sleep
    // await new Promise((r) => setTimeout(r, 100));
  }
}

getTicList().then(() => gs.initAuth().then(() => gs.downloadSpreadsheet().then(processLineByLine)));
