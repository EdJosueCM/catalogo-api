// Inserta productos de ejemplo (datos ficticios). Es idempotente:
// si un producto con el mismo nombre ya existe, se actualiza en lugar de duplicarse.
const { conectarDB, desconectarDB } = require('../src/config/db');
const Producto = require('../src/models/Producto');
const { COLACION } = require('../src/models/Producto');

const productos = [
  { nombre: 'Teclado mecánico K87', descripcion: 'Teclado compacto con switches táctiles', categoria: 'Electrónica', precio: 899.0 },
  { nombre: 'Mouse inalámbrico M300', descripcion: 'Mouse ergonómico de 2.4 GHz con 3 botones', categoria: 'Electrónica', precio: 349.5 },
  { nombre: 'Audífonos Sonora', descripcion: 'Audífonos de diadema con cancelación pasiva', categoria: 'Electrónica', precio: 1299.0 },
  { nombre: 'Taza térmica 450 ml', descripcion: 'Taza de acero inoxidable con tapa hermética', categoria: 'Hogar', precio: 219.9 },
  { nombre: 'Lámpara de escritorio LED', descripcion: 'Lámpara con brillo ajustable y brazo flexible', categoria: 'Hogar', precio: 459.0 },
  { nombre: 'Cuaderno punteado A5', descripcion: 'Cuaderno de 160 páginas con papel de 100 g', categoria: 'Papelería', precio: 129.0 },
  { nombre: 'Set de plumas de gel', descripcion: 'Paquete de 10 plumas de colores, punta 0.7 mm', categoria: 'Papelería', precio: 89.9 },
];

async function main() {
  await conectarDB();
  for (const p of productos) {
    await Producto.findOneAndUpdate({ nombre: p.nombre }, p, {
      upsert: true,
      runValidators: true,
      collation: COLACION,
    });
  }
  const total = await Producto.countDocuments();
  console.log(`Productos de ejemplo listos (${productos.length} del seed, ${total} en total).`);
}

main()
  .catch((err) => {
    console.error('Error al ejecutar el seed:', err.message);
    process.exitCode = 1;
  })
  .finally(desconectarDB);
