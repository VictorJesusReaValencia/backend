const express = require('express');
const multer = require('multer');
const path = require('path');
const Monumentos = require('../models/monumentos'); // Asegúrate de importar tu modelo Monumentos
const MonumentosControlador = require("../controllers/monumentosControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage });
const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-monumentos', MonumentosControlador.pruebaMonumentos);
router.post("/registrar", MonumentosControlador.registrarMonumentos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], MonumentosControlador.registrarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', MonumentosControlador.borrarMonumentos);
router.put('/borrar-imagen/:id', MonumentosControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', MonumentosControlador.borrarPdfs);
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], MonumentosControlador.editarPDFs); // Permite hasta 10 archivos
router.post('/editar-imagen/:id', [subidas.array("files", 10)], MonumentosControlador.editarFotografia); // Permite hasta 10 archivos
router.put('/editar/:id', MonumentosControlador.editarMonumentos);
router.get('/listar-temas', MonumentosControlador.obtenerTemasMonumentos);
router.get('buscar', MonumentosControlador.buscarMonumentos);
router.get('/tema/:id', MonumentosControlador.listarPorTema);
router.get('/icon/:id', MonumentosControlador.obtenerMonumentosPorID);
router.get('/numero-por-pais/:id', MonumentosControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', MonumentosControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', MonumentosControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', MonumentosControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', MonumentosControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', MonumentosControlador.actualizarInstitucion);
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], MonumentosControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/search',MonumentosControlador.getSugerencias)
router.get('/listar-pendientes', MonumentosControlador.listarPendientes);




module.exports = router;