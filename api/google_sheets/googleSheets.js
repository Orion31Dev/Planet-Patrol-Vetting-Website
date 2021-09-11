const fs = require('fs');
const path = require('path')
const request = require('request');
const readline = require('readline');
const { google } = require('googleapis');
const { spawn } = require('child_process');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = './api/google_sheets/token.json';

const SPREADSHEET_ID = '1vI_ho-gpw4xq_VTRyTMB3DdNAytWdckrDANbJ1BEcMU';

client = null;

// Load client secrets from a local file.
function initAuth() {
  return new Promise((resolve, reject) => {
    fs.readFile('./api/google_sheets/credentials.json', (err, content) => {
      if (err) reject(err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), resolve);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    client = oAuth2Client;
    callback();
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      client = oAuth2Client;
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// download spreadsheet as tsv file
function downloadSpreadsheet() {
  return new Promise((resolve, reject) => {
    const filePath = './api/google_sheets/table.tsv';
    const link = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?exportFormat=tsv&amp;gid=78752082`;
    // delete the file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const file = fs.createWriteStream(filePath);
    request(
      {
        url: link,
        followAllRedirects: true,
      },
      function (err, res, body) {
        if (err) {
          reject(err);
        }

        lines = body.split('\n');

        let index = 0;
        let keyLine = '';

        for (const line of lines) {
          if (line.startsWith('TIC ID')) {
            keyLine = line;
            continue;
          }

          // if line starts with a number
          if (line[0].match(/^\d+$/)) break;
          index++;
        }

        // remove index number of lines
        lines.splice(0, index + 1);
        lines.unshift(keyLine);

        file.write(lines.join('\n'));
        file.end();

        console.log('Done downloading spreadsheet.');
        resolve();
      }
    );
  });
}

// Upload tsv file to google sheets
function uploadTsv(filePath) {
  console.log('Uploading ' + filePath);
  const py = spawn(path.join(__dirname, '/python/env/Scripts/python'), [path.join(__dirname, '/python/uploadSheet.py'), filePath]);

  py.stdout.on('data', function (data) {
    console.log(data.toString());
  }); 
  
  py.stderr.on('data', function (data) {
    console.log(data.toString());
  });
}

module.exports = { initAuth, downloadSpreadsheet, uploadTsv };
