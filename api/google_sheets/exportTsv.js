require('dotenv').config();

const fs = require('fs');
const readline = require('readline');
const gs = require('./googleSheets');
const path = require('path');

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
  let fileName = path.join(__dirname, `/${formatDate(new Date())}merged.tsv`);

  fs.appendFile(
    fileName,
    'TIC ID	ExoFOP-TESS	Sectors	Epoch	Period	Duration	Depth	Depth	Rtranister	Rstar	Tmag	Delta Tmag	Paper Disp	Paper Comm	Group Disposition	Reason for Group Disposition	Group Comments (Unused)	Disposition (VK)	Comments (VK)	Disposition (LC)	Comments (LC)	Disposition (HDL)	Comments (HDL)	Disposition (MZDF)	Comments (MZDF)	Disposition (Julien)	Comments (Julien)	Disposition (JY)	Comments (JY)	Disposition (AF)	Comments (AF)	Disposition(MAC)	Comments(MAC)	Disposition(RI)	Comments(RI)	Disposition(FG)	Comments(FG)	Disposition(MH)	Comments(MH)',
    (err) => {
      if (err) throw err;
    }
  );

  const fileStream = fs.createReadStream(path.join(__dirname, '/table.tsv'));

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

  fs.writeFileSync(path.join(__dirname, '/allTics.json'), JSON.stringify(ticList));

  return fileName;
}

// TIC ID,ExoFOP-TESS,Sectors,Epoch,Period,Duration,Depth,Depth,Rtranister,Rstar,Tmag,Delta Tmag,Group Disposition,Reason for Group Disposition,Group Comments,Disposition (VK),Comments (VK),Disposition (LC),Comments (LC),Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
// 0            1        2      3     4       5       6     7      8         9    10      11            12                     13                    14             15              16             17              18             19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36
// Disposition (HDL),Comments (HDL),Disposition (MZDF),Comments (MZDF),Disposition (Julien),Comments (Julien),Disposition (JY),Comments (JY),Disposition (AF),Comments (AF),Disposition(MAC),Comments(MAC),Disposition(RI),Comments(RI),Disposition(FG),Comments(FG),Disposition(MH),Comments(MH)
//        19               20                21              22               23                    24                25             26              27             28               29             30             31            32             33            34           35               36

function formatRow(row, spl) {
  return (
    `\n${row._id.split(':')[1]}\t` +
    `https://exofop.ipac.caltech.edu/tess/target.php?id=${row._id.split(':')[1]}\t` +
    `${spl[2]}\t` +
    `${spl[3]}\t` +
    `${spl[4]}\t` +
    `${spl[5]}\t` +
    `${spl[6]}\t` +
    `${spl[7]}\t` +
    `${spl[8]}\t` +
    `${spl[9]}\t` +
    `${spl[10]}\t` +
    `${spl[11]}\t` +
    `${spl[12]}\t` +
    `${spl[13]}\t` +
    `${row.dispositions['user:group']?.disposition || ''}\t` +
    `${row.dispositions['user:group']?.comments || ''}\t\t` + // row 14, "Group Comments," is unused
    `${row.dispositions['user:veselin.b.kostov@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:veselin.b.kostov@gmail.com']?.comments || ''}\t` +
    `${spl[19] || ''}\t` + // Luca
    `${spl[20] || ''}\t` +
    `${row.dispositions['user:dclaymore@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:dclaymore@gmail.com']?.comments || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:marco.z.difraia@gmail.com']?.comments || ''}\t` +
    `${spl[25] || ''}\t` + // Julien
    `${spl[26] || ''}\t` +
    `${spl[27] || ''}\t` + // John
    `${spl[28] || ''}\t` +
    `${row.dispositions['user:alineuemura@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:alineuemura@gmail.com']?.comments || ''}\t` +
    `${row.dispositions['user:marc.andres.carcasona@gmail.com']?.disposition || ''}\t` +
    `${row.dispositions['user:marc.andres.carcasona@gmail.com']?.comments || ''}\t` +
    `${spl[33] || ''}\t` + // Riccardo
    `${spl[34] || ''}\t` +
    `${spl[35] || ''}\t` + // Francesco
    `${spl[36] || ''}\t` +
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

getTicList().then(() => gs.initAuth().then(() => gs.downloadSpreadsheet().then(() => exportTsv().then(f => gs.uploadTsv(f)))));
