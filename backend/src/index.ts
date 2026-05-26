import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('Backend funcionando ');
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Servidor en puerto 4000');
});