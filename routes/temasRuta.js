const express = require('express');
const multer = require('multer');
const path = require('path');
const Temas = require('../models/temas'); // Asegúrate de importar tu modelo Periodicos
const TemasControlador = require("../controllers/temasControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

const upload = multer({ dest: 'imagenes/' });


router.get('/prueba-temas', TemasControlador.pruebaTemas);
router.post("/registrar", TemasControlador.registrarTemas);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], TemasControlador.cargarFotografia); // Permite hasta 10 archivos
router.post('/editar-imagen/:id', [subidas.array("files", 10)], TemasControlador.editarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', TemasControlador.borrarTemas);
router.put('/editar/:id', TemasControlador.editarTemas);
router.get('/id/:id', TemasControlador.obtenerTemasPorID);
router.get('/tema/:id', TemasControlador.obtenerTemaPorNombre);
router.get("/listar", TemasControlador.listarTemas);

module.exports = router;