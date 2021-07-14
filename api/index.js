var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var DIST_DIR = path.join(__dirname, '../dist');
var INDEX_FILE = path.join(__dirname, '../dist/index.html');
app.use(express.static(DIST_DIR));
app.get('/api', function (_req, res) {
    res.send('hello world');
});
app.get('/', function (_req, res) {
    res.sendFile(INDEX_FILE);
});
app.listen(port);
