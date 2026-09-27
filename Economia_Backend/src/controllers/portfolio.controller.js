const portfolioService = require('../services/portfolio.service');

class PortfolioController {
    async calcularPortafolio(req, res) {
        try {
            const { fechaInicio, fechaFin, capitalInicialGlobal, inversiones } = req.body;

            if (!capitalInicialGlobal || !inversiones || inversiones.length === 0) {
                return res.status(400).json({ 
                    mensaje: 'Faltan datos. Asegúrate de enviar capitalInicialGlobal y las inversiones.' 
                });
            }

            // Pasamos el capital global al servicio
            const resultado = await portfolioService.procesarResumen(fechaInicio, fechaFin, capitalInicialGlobal, inversiones);
            
            res.status(200).json(resultado);

        } catch (error) {
            console.error('Error en calcularPortafolio:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
}

module.exports = new PortfolioController();