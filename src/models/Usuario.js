const { Schema, model } = require('mongoose');

const ROLES = ['usuario', 'admin'];

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 80 },
    correo: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 120 },
    // select: false evita que el hash salga en consultas por accidente.
    passwordHash: { type: String, required: true, select: false },
    rol: { type: String, enum: ROLES, default: 'usuario' },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = model('Usuario', usuarioSchema, 'usuarios');
module.exports.ROLES = ROLES;
