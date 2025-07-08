const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');
const bucket = require('../database/firebase_config');
const videos = require('../models/videos');

//* Funciones CRUD
const registrarVideo = async (req, res) => {
    let parametros = req.body;

    try {
        // 👉 Formatear la fecha de publicación si viene incluida
        if (parametros.fecha_publicacion) {
            const fechaOriginal = new Date(parametros.fecha_publicacion);
            parametros.fecha_publicacion = format(fechaOriginal, 'yyyy-MM-dd');
        }

        // 👉 Asignar la fecha de registro legible
        parametros.fecha_registro = new Date()

        // 👉 Crear y guardar la publicación
        const publicacion = new videos(parametros);
        const publicacionGuardada = await publicacion.save();

        return res.status(200).json({
            status: "success",
            mensaje: "Publicación periódica guardada correctamente",
            publicacionGuardada
        });

    } catch (error) {
        console.error("🔥 Error real:", error);

        return res.status(400).json({
            status: "error",
            mensaje: error.message || "Error desconocido",
            error: error.errors || error,
            parametros
        });
    }
};
const cargarVideo = async (req, res) => {
    const archivos = req.files;
    const id = req.params.id;

    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ningun video"
        });
    }

    const urlsFirebase = [];

    try {
        const doc = await videos.findById(id);
        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Registro no encontrado"
            });
        }

        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const titulo = limpiarTexto(doc.titulo);

        for (let archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (!["mp4", "avi", "mov", "mkv"].includes(extension)) {
                return res.status(400).json({
                    status: "error",
                    message: "Extensión no permitida",
                    extension
                });
            }

            // 🧠 Generar nombre limitado a 50 caracteres (sin contar timestamp)
            let baseName = `Video_${titulo}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombreFirebase = `${baseName}_${timestamp}`;
            const uuid = uuidv4();

            const file = bucket.file(nombreFirebase);

            await file.save(archivo.buffer, {
                metadata: {
                    contentType: archivo.mimetype,
                    metadata: { firebaseStorageDownloadTokens: uuid }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombreFirebase)}?alt=media&token=${uuid}`;

            urlsFirebase.push({ nombre: nombreFirebase, url });
        }

        doc.firebase_videos = urlsFirebase; // Actualiza el campo correcto en la base de datos
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "videos subidos y guardados correctamente",
            firebase_videos: urlsFirebase // Devuelve el campo actualizado
        });

    } catch (error) {
        console.error("❌ Error al subir o guardar videos:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al procesar videos",
            error
        });
    }
};
const borrarVideo = async (req, res) => {
    const id = req.params.id;

    try {
        const doc = await videos.findById(id);

        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Video no encontrado"
            });
        }

        let erroresEliminacion = [];

        // 🗑️ Eliminar videos de Firebase
        if (doc.firebase_videos && doc.firebase_videos.length > 0) {
            for (const video of doc.firebase_videos) {
                try {
                    const pathName = decodeURIComponent(video.url.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ Video eliminado de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar el video: ${video.nombre}`);
                    erroresEliminacion.push(`video: ${video.nombre}`);
                }
            }
        }

        // ❌ Si hubo errores, NO se borra el documento
        if (erroresEliminacion.length > 0) {
            return res.status(500).json({
                status: "error",
                message: "No se pudieron eliminar todos los videos, el documento no fue borrado",
                archivosNoEliminados: erroresEliminacion
            });
        }

        // ✅ Si todo fue eliminado correctamente, borrar el documento de MongoDB
        await videos.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            message: "Video y archivos asociados eliminados correctamente"
        });

    } catch (error) {
        console.error("❌ Error en borrarVideo:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error al borrar el video"
        });
    }
};
const editarVideo = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let video = await videos.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!video) {
            return res.status(404).json({
                status: "error",
                message: "Video no encontrado"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Video actualizado exitosamente",
                video
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el video",
            error: error.message || "Error desconocido"
        });
    }
};
const editarArchivosVideo = async (req, res) => {
    const archivos = req.files;
    const id = req.params.id;
    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ningún archivo de video"
        });
    }
    const urlsFirebase = [];
    try {
        const doc = await videos.findById(id);
        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Registro no encontrado"
            });
        }

        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const titulo = limpiarTexto(doc.titulo);

        // 🧹 Eliminar videos anteriores de Firebase
        if (doc.firebase_videos && doc.firebase_videos.length > 0) {
            for (const video of doc.firebase_videos) {
                try {
                    const pathName = decodeURIComponent(video.url.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ Video eliminado de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar el video: ${video.nombre}`);
                }
            }
        }
        // 🆕 Subir nuevos videos
        for (const archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (!["mp4", "avi", "mov", "mkv"].includes(extension)) {
                return res.status(400).json({
                    status: "error",
                    message: "Extensión no permitida",
                    extension
                });
            }
            // 📛 Generar nombre truncado
            let baseName = `Video_${titulo}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombreFirebase = `${baseName}_${timestamp}`;
            const uuid = uuidv4();

            const file = bucket.file(nombreFirebase);

            await file.save(archivo.buffer, {
                metadata: {
                    contentType: archivo.mimetype,
                    metadata: { firebaseStorageDownloadTokens: uuid }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombreFirebase)}?alt=media&token=${uuid}`;

            urlsFirebase.push({ nombre: nombreFirebase, url });
        }
        // 💾 Guardar nuevas URLs en MongoDB
        doc.firebase_videos = urlsFirebase;
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "Videos actualizados correctamente",
            firebase_videos: urlsFirebase
        });
    } catch (error) {
        console.error("❌ Error en editarArchivosVideo:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error desconocido",
            error
        });
    }
};
//!aqui
const listarVideo = async (req, res) => {
    const { id } = req.params;
    const { categoria } = req.query;
    try {
        let resultado;
        if (id) {
            resultado = await videos.findById(id);
            if (!resultado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Video no encontrado"
                });
            }
        } else {
            const filtro = {};
            if (categoria) {
                filtro.categoria = { $regex: new RegExp(categoria, "i") };
            }

            resultado = await videos.find(filtro).sort({ fecha_registro: -1 });
        }
        return res.status(200).json({
            status: "success",
            mensaje: id
                ? "Video obtenido correctamente"
                : categoria
                    ? `Videos filtrados por categoría '${categoria}'`
                    : "Listado de videos obtenido correctamente",
            videos: resultado
        });

    } catch (error) {
        console.error("❌ Error al listar videos:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al recuperar videos",
            error: error.message
        });
    }
};

module.exports = {
    registrarVideo,
    cargarVideo,
    borrarVideo,
    editarVideo,
    editarArchivosVideo,
    listarVideo,
};