const express = require('express');
const multer = require('multer');
const VideosControlador = require("../controllers/videosControlador");
const router = express.Router();

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage });

router.post("/registrar", VideosControlador.registrarVideo);
router.post('/cargar-videos/:id', [subidas.array("files", 60)], VideosControlador.cargarVideo);
router.delete('/borrar/:id', VideosControlador.borrarVideo);
router.post('/editar-descripcion/:id', VideosControlador.editarVideo);
router.post('/editar-archivo/:id', [subidas.array("files", 60)], VideosControlador.editarArchivosVideo);
router.get("/lista-videos/:id?", VideosControlador.listarVideo);
router.get("/descripcion/:id", VideosControlador.listarVideo);

module.exports = router;