const { Schema, model } = require('mongoose');

const favoritoSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  },
  {
    timestamps: { createdAt: 'agregadoEn', updatedAt: false },
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.usuario;
        return ret;
      },
    },
  }
);

// Un usuario no puede tener el mismo producto dos veces en favoritos.
favoritoSchema.index({ usuario: 1, producto: 1 }, { unique: true });
// Permite borrar rápido los favoritos de un producto eliminado.
favoritoSchema.index({ producto: 1 });

module.exports = model('Favorito', favoritoSchema, 'favoritos');
