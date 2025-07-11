const express = require('express');
const multer = require('multer');
const path = require('path');
const Objetos = require('../models/objetos'); // Asegúrate de importar tu modelo Objetos
const ObjetosControlador = require("../controllers/objetosControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/objetos");
  },
  filename: async function (req, file, cb) {
    try {
      const objetos = await Objetos.findById(req.params.id);
      if (!objetos) {
        return cb(new Error('Objetos no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Objetos,${objetos.tipo_objetos}_${objetos.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/objetos');
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

router.get('/prueba-objetos', ObjetosControlador.pruebaObjetos);
router.post("/registrar", ObjetosControlador.registrarObjetos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], ObjetosControlador.registrarFotografia); // Permite hasta 10 archivos
router.post('/editar-imagen/:id', [subidas.array("files", 10)], ObjetosControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], ObjetosControlador.editarPDFs); // Permite hasta 10 archivos
router.get("/buscar", ObjetosControlador.buscarObjetos);
router.delete('/borrar/:id', ObjetosControlador.borrarObjetos);
router.put('/editar/:id', ObjetosControlador.editarObjetos);
router.get('/listar-temas', ObjetosControlador.obtenerTemasObjetos);
router.get('/tema/:id', ObjetosControlador.listarPorTema);
router.get('/icon/:id', ObjetosControlador.obtenerObjetosPorID);
router.get('/numero-por-pais/:id', ObjetosControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', ObjetosControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', ObjetosControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', ObjetosControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', ObjetosControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', ObjetosControlador.actualizarInstitucion);
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], ObjetosControlador.registrarPDF); // Permite hasta 10 archivos
router.post('/gpt/image-text/:id', upload.single('file'), ObjetosControlador.processTextAndImage);
router.get('/search',ObjetosControlador.getSugerencias)
router.get('/listar-pendientes', ObjetosControlador.listarPendientes);
router.put('/borrar-imagen/:id', ObjetosControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', ObjetosControlador.borrarPdfs);

module.exports = router;