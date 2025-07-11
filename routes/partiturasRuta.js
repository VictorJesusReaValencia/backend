const express = require('express');
const multer = require('multer');
const path = require('path');
const Partituras = require('../models/partituras'); // Asegúrate de importar tu modelo Partituras
const PartiturasControlador = require("../controllers/partiturasControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/partituras");
  },
  filename: async function (req, file, cb) {
    try {
      const partituras = await Partituras.findById(req.params.id);
      if (!partituras) {
        return cb(new Error('Partituras no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Partituras,${partituras.titulo}_${partituras.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/partituras');
      const matchingFiles = files.filter(f => f.startsWith(baseNombreArchivo));

      // Contar archivos coincidentes para determinar el próximo número
      const nextNumber = matchingFiles.length + 1;

      const nombreArchivo = `${baseNombreArchivo}_${nextNumber}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage });
const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-partituras', PartiturasControlador.pruebaPartituras);
router.post("/registrar", PartiturasControlador.registrarPartituras);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], PartiturasControlador.registrarFotografia); // Permite hasta 10 archivos
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], PartiturasControlador.registrarPDF); // Permite hasta 10 archivos
router.delete('/borrar/:id', PartiturasControlador.borrarPartituras);
router.put('/borrar-imagen/:id', PartiturasControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', PartiturasControlador.borrarPdfs);
router.put('/editar/:id', PartiturasControlador.editarPartituras);
router.get('/listar-temas', PartiturasControlador.obtenerTemasPartituras);
router.get('/tema/:id', PartiturasControlador.listarPorTema);
router.get('/icon/:id', PartiturasControlador.obtenerPartiturasPorID);
router.get('/numero-por-pais/:id', PartiturasControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', PartiturasControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', PartiturasControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', PartiturasControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', PartiturasControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', PartiturasControlador.actualizarInstitucion);
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], PartiturasControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/search',PartiturasControlador.getSugerencias)
router.get('/listar-pendientes', PartiturasControlador.listarPendientes);
router.get('/buscar', PartiturasControlador.buscarPartituras);
router.post('/editar-imagen/:id', [subidas.array("files", 10)], PartiturasControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], PartiturasControlador.editarPDFs); // Permite hasta 10 archivos

module.exports = router;