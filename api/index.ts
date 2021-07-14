const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_FILE = path.join(__dirname, '../dist/index.html');

app.use(express.static(DIST_DIR));

app.get('/api', (_req: any, res: any) => {
  res.send('hello world');
});

app.get('/*', (_req: any, res: any) => {
  res.sendFile(INDEX_FILE, { DIST_DIR });
});

app.listen(port);