// This script will replace all paper dispositions on the website with the ones in newPaperDisps.tsv

require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let ticList = [];
let failures = [];

async function getTicList() {
  let pList = await db.partitionedList('tic', { include_docs: true });
  ticList = pList.rows;

  while (ticList.length < pList.total_rows) {
    pList = await db.partitionedList('tic', { include_docs: true, startkey: `${ticList[ticList.length - 1].id}\0` });
    ticList = ticList.concat(pList.rows);
  }

  console.log('Fetched TICs');
}

async function removeAllPaperDispsFromWebsite() {
  for await (const t of ticList) {
    if (t.doc.dispositions['user:paper']) {
      let doc = t.doc;

      console.log('Removing Paper Disp From ' + t.id);
      delete doc.dispositions['user:paper'];

      try {
        await db.insert(doc);
      } catch (e) {
        console.log('Failed.');
      }

      await new Promise((r) => setTimeout(r, 120));
    }
  }
}

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

    let id = 'tic:' + spl[0];

    //console.log(ticList[0]);

    let tic = ticList.find((t) => t.id.includes(id) && t.doc.epoch === parseFloat(spl[3]));

    if (!tic) {
      console.log(`Missing TIC on Website: ${spl[0]} with epoch ${spl[3]}`);
      continue;
    }

    tic = tic.doc;

    // Just in case
    if (parseFloat(spl[3]) !== tic.epoch) {
      console.log('Epoch mismatch: ' + id, parseFloat(spl[3]), tic.epoch);
      continue;
    }

    tic.dispositions['user:paper'] = {
      disposition: spl[12],
      comments: spl[13] === 'null' ? '' : spl[13] || '',
    };

    console.log('Inserting ' + tic._id);

    try {
      await db.insert(tic);
      cont = false;
    } catch {
      console.log('Failed.');
      failures.push(spl[0]);
      await new Promise((r) => setTimeout(r, 2000));
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('Done.');
  console.log('Failures:', failures);
}

getTicList().then(() => {
  removeAllPaperDispsFromWebsite().then(() => {
    getTicList().then(() => {
      processLineByLine();
    });
  });
});
