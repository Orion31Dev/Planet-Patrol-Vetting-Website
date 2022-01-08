require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let ticList = [];

async function getTicList() {
  let pList = await db.partitionedList('tic', { include_docs: true });
  ticList = pList.rows;

  while (ticList.length < pList.total_rows) {
    pList = await db.partitionedList('tic', { include_docs: true, startkey: `${ticList[ticList.length - 1].id}\0` });
    ticList = ticList.concat(pList.rows);
  }

  console.log('Fetched TICs');
}

let good = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream('./api/google_sheets/newPaperDisps.tsv');

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

    if (
      ticList.some((t) => {
        //if (t.doc.dispositions['user:paper']) console.log(t.doc.dispositions['user:paper'].disposition, spl[12], t.doc.dispositions['user:paper'].comments, spl[13]);
        return (
          t.id.includes(spl[0]) &&
          t.doc.epoch === parseFloat(spl[3]) &&
          t.doc.dispositions['user:paper'] &&
          t.doc.dispositions['user:paper'].disposition === spl[12] &&
          t.doc.dispositions['user:paper'].comments === spl[13]
        );
      })
    ) {
      good++;
      //console.log(`Good: ${spl[0]} with epoch ${spl[3]}`);
      continue;
    }

    console.log(`Incorrect Data for TIC: ${spl[0]} with epoch ${spl[3]}`);
  }

  console.log(`Good: ${good}`);
  console.log('Total with Paper Disp: ' + ticList.filter(t => t.doc.dispositions['user:paper']).length);
}

getTicList().then(processLineByLine);
