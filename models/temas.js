const { Schema, model } = require("mongoose");

const TemasSchema = new Schema({
  ciudad: { type: String, required: false },
  fecha_registro: { type: Date, default: Date.now },
  images: [
    {
      nombre: { type: String },
      fileId: { type: String }
    }
  ],
  institucion: { type: String },
  nombre_tema: { type: String, required: false },
  notas: { type: String },
  numero_registro: { type: Number },
  pais: { type: String, required: false },
  tomo: { type: String },
  persona_registra: { type: String },
  pdfs: [
    {
      nombre: { type: String, required: false },
      ruta: { type: String, required: false }
    }
  ],
  tipoBien: {type: String},
  revisiones: [
    {
      persona: { type: String, required: false },
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  imagenes_fb: [{
    nombre: { type: String, maxlength: 50 },
    url: { type: String }
  }],
  tipo_bien: { type: String, default: "Periódico" },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Temas", TemasSchema, "temas");
