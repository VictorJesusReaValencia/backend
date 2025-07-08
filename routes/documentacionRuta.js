const express = require('express');
const multer = require('multer');
const path = require('path');
const Documentacion = require('../models/documentacion'); // Asegúrate de importar tu modelo Documentacion
const DocumentacionControlador = require("../controllers/documentacionControlador");
const router = express.Router();
const fs = require('fs');


const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

router.get('/prueba-documentacion', DocumentacionControlador.pruebaDocumentacion);
router.post("/registrar", DocumentacionControlador.registrarDocumentacion);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], DocumentacionControlador.registrarFotografia); // Permite hasta 10 archivos
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], DocumentacionControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/buscar', DocumentacionControlador.buscarDocumentacion);
router.delete('/borrar/:id', DocumentacionControlador.borrarDocumentacion);
router.put('/borrar-imagen/:id', DocumentacionControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', DocumentacionControlador.borrarPdfs);

router.put('/editar/:id', DocumentacionControlador.editarDocumentacion);
router.post('/editar-imagen/:id', [subidas.array("files", 10)], DocumentacionControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], DocumentacionControlador.editarPDFs); // Permite hasta 10 archivos

router.get('/listar-temas', DocumentacionControlador.obtenerTemasDocumentacion);
router.get('/tema/:id', DocumentacionControlador.listarPorTema);
router.get('/docu/:id', DocumentacionControlador.obtenerDocumentacionPorID);

router.get('/numero-por-pais/:id', DocumentacionControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', DocumentacionControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', DocumentacionControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', DocumentacionControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', DocumentacionControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', DocumentacionControlador.actualizarInstitucion);
router.get('/search',DocumentacionControlador.getSugerencias)
router.get('/listar-pendientes', DocumentacionControlador.listarPendientes);

module.exports = router;