require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let ticList;

async function getTicList() {
  //ticList = (await db.partitionedList('tic')).rows;
  //ticList.push(await db.partitionedList('tic', { offset: 2000 }).rows);
  console.log(await db.partitionedList('tic'));
}

let ids = {};

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

    let spl = line.split('\t');
    let id = spl[0];
    if (!ids[id]) ids[id] = 2;
    else id += `(${ids[id]++})`;

    if (ticList.some((t) => t.id === 'tic:' + id)) {
      //if (id.includes('(')) console.log('Verified ' + id);
    } else {
      console.error('Missing ' + id);
    }
  }

  ticList.forEach((tic) => {
    if (tic.id === 'tic:80166433') {
      console.log(tic);
    }
  });

  console.log('Done.');
}

getTicList()//.then(processLineByLine);
