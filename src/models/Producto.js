const { Schema, model } = require('mongoose');

// Comparación sin distinguir mayúsculas ni acentos para nombre y categoría.
const COLACION = { locale: 'es', strength: 1 };

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 100 },
    descripcion: { type: String, required: true, trim: true, maxlength: 500 },
    categoria: { type: String, required: true, trim: true, maxlength: 50 },
    precio: {
      type: Number,
      required: true,
      validate: { validator: (v) => Number.isFinite(v) && v > 0, message: 'El precio debe ser mayor que cero' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// No se permiten dos productos con el mismo nombre ("Teclado" == "teclado").
productoSchema.index({ nombre: 1 }, { unique: true, collation: COLACION });
productoSchema.index({ categoria: 1 }, { collation: COLACION });

module.exports = model('Producto', productoSchema, 'productos');
module.exports.COLACION = COLACION;
