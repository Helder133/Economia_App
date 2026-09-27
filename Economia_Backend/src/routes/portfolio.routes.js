const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');

// Definir que cuando haya un POST a esta ruta, ejecute el controlador
router.post('/resumen', portfolioController.calcularPortafolio);

module.exports = router;