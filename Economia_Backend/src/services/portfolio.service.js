class PortfolioService {
    async procesarResumen(fechaInicio, fechaFin, capitalInicialGlobal, inversiones) {
        let totalInvertido = 0;
        let valorActualTotalAcciones = 0;

        const resumenInversiones = inversiones.map(inversion => {
            const { empresa, ticker, cantidad, precioCompra } = inversion;
            
            // Cuánto del millón nos costó comprar estas acciones
            const costoTotalCompra = cantidad * precioCompra;
            totalInvertido += costoTotalCompra;
            
            // TODO: Consultar precio final en la API externa usando el 'ticker'
            const precioActualSimulado = precioCompra * 1.05; // Simulando que subió un 5%
            
            const valorActual = cantidad * precioActualSimulado;
            valorActualTotalAcciones += valorActual;

            return {
                empresa,
                ticker,
                cantidad,
                precioCompra,
                precioActual: precioActualSimulado,
                costoTotalCompra,
                valorActual,
                gananciaPerdidaDinero: valorActual - costoTotalCompra,
                gananciaPerdidaPorcentaje: ((valorActual - costoTotalCompra) / costoTotalCompra) * 100
            };
        });

        // Cálculos de la cuenta global
        const efectivoSobrante = capitalInicialGlobal - totalInvertido;
        const valorFinalPortafolio = valorActualTotalAcciones + efectivoSobrante;
        
        // Rendimiento sobre el millón completo
        const rendimientoGlobalDinero = valorFinalPortafolio - capitalInicialGlobal;
        const rendimientoGlobalPorcentaje = (rendimientoGlobalDinero / capitalInicialGlobal) * 100;

        return {
            periodo: { inicio: fechaInicio, fin: fechaFin },
            resumenIndividual: resumenInversiones,
            cuentaGlobal: {
                capitalInicial: capitalInicialGlobal,
                totalUtilizadoEnAcciones: totalInvertido,
                efectivoSobrante: efectivoSobrante,
                valorFinalAcciones: valorActualTotalAcciones,
                valorFinalTotalPortafolio: valorFinalPortafolio,
                rendimientoNetoDinero: rendimientoGlobalDinero,
                rendimientoNetoPorcentaje: rendimientoGlobalPorcentaje
            }
        };
    }
}

module.exports = new PortfolioService();