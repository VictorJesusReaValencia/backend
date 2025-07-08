const express = require('express');
const multer = require('multer');
const path = require('path');
const Libros = require('../models/libros'); // Asegúrate de importar tu modelo Libros
const LibrosControlador = require("../controllers/libroControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();

const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria
const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-libros', LibrosControlador.pruebaLibros);
router.post("/registrar", LibrosControlador.registrarLibros);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], LibrosControlador.registrarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', LibrosControlador.borrarLibro);
router.put('/editar/:id', LibrosControlador.editarLibros);
router.get('/listar-temas', LibrosControlador.obtenerTemasLibros);
router.get('/tema/:id', LibrosControlador.listarPorTema);
router.get('/libro/:id', LibrosControlador.obtenerLibrosPorID);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], LibrosControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/numero-por-pais/:id', LibrosControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', LibrosControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', LibrosControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', LibrosControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', LibrosControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', LibrosControlador.actualizarInstitucion);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], LibrosControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/search',LibrosControlador.getSugerencias)
router.get('/listar-pendientes', LibrosControlador.listarPendientes);

router.post('/editar-imagen/:id', [subidas.array("files", 10)], LibrosControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], LibrosControlador.editarPDFs); // Permite hasta 10 archivos



module.exports = router;