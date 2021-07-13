import express from 'express';
const app = express();

const port = process.env.PORT || 3000;

app.get('/api', (_req, res) => {
  res.send("hello world");
});

app.get('/', (_req, res) => {
  res.status(200).send('Hello World!');
 });

 app.listen(port);