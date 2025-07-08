const { Schema, model } = require('mongoose');

const VideoSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: false },
    autor: { type: String, required: false },
    fecha_publicacion: { type: Date, default: Date.now },
    duracion: { type: Number, required: false },
    url: { type: String, required: false },
    categoria: { type: String, required: false },
    etiquetas: [{ type: String }],
    firebase_videos: [
        {
            nombre: { type: String, required: false },
            url: { type: String, required: false }
        }
    ]
});

module.exports = model('Video', VideoSchema);