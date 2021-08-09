require('dotenv').config();

const fs = require('fs');
const readline = require('readline');

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });
const db = cloudant.use('planet-patrol-db');

let ticList;

async function getTicList() {
  ticList = (await db.partitionedList('tic', { include_docs: true })).rows;
}

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

    let spl = line.split('\t');
    // Each line in input.txt will be successively available here as `line`.
    //console.log(format(line).dispositions);
    if (ticList.some(t => t.id === "tic:" + spl[0])) {
      //console.log('Verified ' + spl[0]);
    } else {
      console.error("Missing " + spl[0]);
    }
  }

  console.log("Done.");
}

getTicList().then(processLineByLine);
