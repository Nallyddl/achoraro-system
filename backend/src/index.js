import express from 'express';
const app = express();
app.get('/', (_req, res) => {
    res.send('Backend funcionando ');
});
app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor en puerto 3000');
});
//# sourceMappingURL=index.js.map