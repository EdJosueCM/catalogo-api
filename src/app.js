const express = require('express');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const favoritosRoutes = require('./routes/favoritos.routes');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errores');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

app.get('/api/salud', (_req, res) => res.json({ ok: true, data: { estado: 'activo' } }));
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/favoritos', favoritosRoutes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
