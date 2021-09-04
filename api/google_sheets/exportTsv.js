require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let ticList;

async function getTicList() {
  await new Promise((r) => setTimeout(r, 1000)); // Prevent rate limiting

  let pList = await db.partitionedList('tic', { include_docs: true });
  ticList = pList.rows;

  while (ticList.length < pList.total_rows) {
    await new Promise((r) => setTimeout(r, 1000)); // Prevent rate limiting

    pList = await db.partitionedList('tic', { include_docs: true, startkey: `${ticList[ticList.length - 1].id}\0` });
    ticList = ticList.concat(pList.rows);
  }
}

async function exportTsv() {
  let fileName = `./api/google_sheets/${formatDate(new Date())}mixed.tsv`;

  fs.appendFile(
    fileName,
    'TIC ID	ExoFOP-TESS	Sectors	Epoch	Period	Duration	Depth	Depth	Rtranister	Rstar	Tmag	Delta Tmag	Group Disposition	Reason for Group Disposition	Group Comments	Disposition (VK)	Comments (VK)	Disposition (LC)	Comments (LC)	Disposition (HDL)	Comments (HDL)	Disposition (MZDF)	Comments (MZDF)	Disposition (Julien)	Comments (Julien)	Disposition (JY)	Comments (JY)	Disposition (AF)	Comments (AF)	Disposition(MAC)	Comments(MAC)	Disposition(RI)	Comments(RI)	Disposition(FG)	Comments(FG)	Disposition(MH)	Comments(MH)',
    (err) => {
      if (err) throw err;
    }
  );

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

    let spl = line.split('\t');
    let id = spl[0];

    let filterArr = ticList.filter((t) => t.id === 'tic:' + id);

    if (filterArr.length === 1) {
      fs.appendFile(fileName, formatRow(filterArr[0].doc, spl), function (err) {
        if (err) throw err;
      });
    } else {
      console.log(`Matches in ticList w/ id=${id}: ${filterArr.length}`);
    }
  }

  console.log('Exported ' + fileName);
}

// TIC ID,ExoFOP-TESS,Sectors,Epoch,Period,Duration,Depth,Depth,Rtranister,Rstar,Tmag,Delta Tmag,Group Disposition,Reason for Group Disposition,Group Comments,Disposition (VK),Comments (VK),Disposition (LC),Comments (LC),Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
// 0            1        2      3     4       5       6     7      8         9    10      11            12                     13                    14             15              16             17              18             19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36
// Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
//        19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36

function formatRow(row, spl) {
  return (
    `\n${row._id.split(':')[1]}\t` +
    `https://exofop.ipac.caltech.edu/tess/target.php?id=${row._id.split(':')[1]}\t` +
    `${row.sectors}\t` +
    `${row.epoch}\t` +
    `${row.period}\t` +
    `${row.duration}\t` +
    `${row.depth}\t` +
    `${row.depthPercent}\t` +
    `${row.rTranister}\t` +
    `${row.rStar}\t` +
    `${row.tmag}\t` +
    `${row.deltaTmag}\t` +
    `${row.dispositions['user:group']?.disposition || ''}\t` +
    `${row.dispositions['user:group']?.comments || ''}\t\t` + // row 14, "Group Comments," is unused
    `${row.dispositions['veselin.b.kostov@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['veselin.b.kostov@gmail.com']?.comments || ''}\t` +
    `${spl[17] || ''}\t` + // Luca
    `${spl[18] || ''}\t` +
    `${row.dispositions['user:dclaymore@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:dclaymore@gmail.com']?.comments || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.comments || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.comments || ''}\t` +
    `${spl[23] || ''}\t` + // Julien
    `${spl[24] || ''}\t` +
    `${spl[25] || ''}\t` + // John
    `${spl[26] || ''}\t` +
    `${row.dispositions['user:alineuemura@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:alineuemura@gmail.com']?.comments || ''}\t` +
    `${row.dispositions['user:marc.andres.carcasona@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:marc.andres.carcasona@gmail.com']?.comments || ''}\t` +
    `${spl[31] || ''}\t` + // Riccardo
    `${spl[32] || ''}\t` +
    `${spl[33] || ''}\t` + // Francesco
    `${spl[34] || ''}\t` +
    `${row.dispositions['user:michiharu.hyogo77@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:michiharu.hyogo77@gmail.com']?.comments || ''}\t`
  );
}

function formatDate(m) {
  return (
    m.getUTCFullYear() +
    '-' +
    ('0' + (m.getUTCMonth() + 1)).slice(-2) +
    '-' +
    ('0' + m.getUTCDate()).slice(-2) +
    '@' +
    ('0' + m.getUTCHours()).slice(-2) +
    '-' +
    ('0' + m.getUTCMinutes()).slice(-2) +
    '-' +
    ('0' + m.getUTCSeconds()).slice(-2)
  );
}

getTicList().then(exportTsv);
