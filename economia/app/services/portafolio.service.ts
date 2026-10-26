import YahooFinance from 'yahoo-finance2';
import { InversionInput } from '../models/invresion.models';

const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] });

class PortfolioService {
    async procesarResumen(fechaCompra: string, fechaRevision: string, capitalInicialGlobal: number, inversiones: InversionInput[]) {
        let totalInvertido = 0;
        let valorActualTotalAcciones = 0;

        // Paso 1: Consultar la API para cada inversión de forma concurrente
        const inversionesConPrecios = await Promise.all(
            inversiones.map(async (inversion) => {
                const { empresa, ticker, cantidad } = inversion;

                // Consultar historial diario. (Nota: los fines de semana no hay bolsa)
                const historial: any[] = await yahooFinance.historical(ticker, {
                    period1: fechaCompra,
                    period2: fechaRevision,
                    interval: '1d'
                });

                if (historial.length === 0) {
                    throw new Error(`No se encontraron datos para ${ticker} en este rango de fechas.`);
                }

                // Extraer precios reales (el primer registro es la compra, el último la revisión)
                const precioCompra = historial[0].close;
                console.log('Precio real de', ticker, ':', precioCompra);
                const precioActual = historial[historial.length - 1].close;

                const costoTotalCompra = cantidad * precioCompra;
                const valorActual = cantidad * precioActual;

                return {
                    empresa,
                    ticker,
                    cantidad,
                    precioCompra,
                    precioActual,
                    costoTotalCompra,
                    valorActual,
                    historialPrecios: historial // Guardamos esto temporalmente para calcular los picos más adelante
                };
            })
        );

        // Paso 2: Validar que la compra no supere el capital inicial
        inversionesConPrecios.forEach(inv => {
            totalInvertido += inv.costoTotalCompra;
            valorActualTotalAcciones += inv.valorActual;
        });

        if (totalInvertido > capitalInicialGlobal) {
            throw new Error(`Fondos insuficientes. La inversión total ($${totalInvertido.toFixed(2)}) supera el capital de $${capitalInicialGlobal}.`);
        }

        // Cálculos globales
        const resumenIndividual = inversionesConPrecios.map(({ historialPrecios, ...resto }) => {
            const gananciaPerdidaDinero = resto.valorActual - resto.costoTotalCompra;
            const gananciaPerdidaPorcentaje = (gananciaPerdidaDinero / resto.costoTotalCompra) * 100;

            return {
                ...resto,
                gananciaPerdidaDinero,
                gananciaPerdidaPorcentaje
            };
        });

        // Extraer la mejor y peor acción 
        const mejorAccion = resumenIndividual.reduce((prev, current) =>
            prev.gananciaPerdidaPorcentaje > current.gananciaPerdidaPorcentaje ? prev : current
        );

        const peorAccion = resumenIndividual.reduce((prev, current) =>
            prev.gananciaPerdidaPorcentaje < current.gananciaPerdidaPorcentaje ? prev : current
        );

        // Cálculos globales
        const efectivoSobrante = capitalInicialGlobal - totalInvertido;
        const valorFinalPortafolio = valorActualTotalAcciones + efectivoSobrante;
        const rendimientoGlobalDinero = valorFinalPortafolio - capitalInicialGlobal;

        const valorDiarioPortafolio = new Map<string, number>();

        inversionesConPrecios.forEach(inv => {
            inv.historialPrecios.forEach(dia => {
                // yahoo-finance2 devuelve 'date' como objeto Date
                const fechaStr = dia.date.toISOString().split('T')[0];
                const valorEnEseDia = inv.cantidad * dia.close;

                const valorAcumulado = valorDiarioPortafolio.get(fechaStr) || 0;
                valorDiarioPortafolio.set(fechaStr, valorAcumulado + valorEnEseDia);
            });
        });

        // 2. Ordenar cronológicamente y calcular la variación diaria
        const historialFechas = Array.from(valorDiarioPortafolio.keys()).sort();
        let mejorDia = { fecha: '', porcentaje: -Infinity };
        let peorDia = { fecha: '', porcentaje: Infinity };

        const historialGrafica = historialFechas.map(fecha => ({
            fecha,
            valor: valorDiarioPortafolio.get(fecha)! + efectivoSobrante
        }));

        for (let i = 1; i < historialFechas.length; i++) {
            const fechaAyer = historialFechas[i - 1];
            const fechaHoy = historialFechas[i];

            // Sumamos el efectivo sobrante (que no cambia) al valor de las acciones para sacar el % real
            const valorAyer = valorDiarioPortafolio.get(fechaAyer)! + efectivoSobrante;
            const valorHoy = valorDiarioPortafolio.get(fechaHoy)! + efectivoSobrante;

            const variacionPorcentaje = ((valorHoy - valorAyer) / valorAyer) * 100;

            if (variacionPorcentaje > mejorDia.porcentaje) {
                mejorDia = { fecha: fechaHoy, porcentaje: variacionPorcentaje };
            }
            if (variacionPorcentaje < peorDia.porcentaje) {
                peorDia = { fecha: fechaHoy, porcentaje: variacionPorcentaje };
            }
        }

        return {
            periodo: { inicio: fechaCompra, fin: fechaRevision },
            resumenIndividual,
            historialGrafica,
            estadisticasActivos: {
                mejorAccion: {
                    ticker: mejorAccion.ticker,
                    gananciaPorcentaje: mejorAccion.gananciaPerdidaPorcentaje,
                    gananciaDinero: mejorAccion.gananciaPerdidaDinero
                },
                peorAccion: {
                    ticker: peorAccion.ticker,
                    gananciaPorcentaje: peorAccion.gananciaPerdidaPorcentaje,
                    gananciaDinero: peorAccion.gananciaPerdidaDinero
                },
                rendimientoDiario: {
                    mejorDia,
                    peorDia
                }
            },
            cuentaGlobal: {
                capitalInicial: capitalInicialGlobal,
                totalUtilizadoEnAcciones: totalInvertido,
                efectivoSobrante,
                valorFinalAcciones: valorActualTotalAcciones,
                valorFinalTotalPortafolio: valorFinalPortafolio,
                rendimientoNetoDinero: rendimientoGlobalDinero,
                rendimientoNetoPorcentaje: (rendimientoGlobalDinero / capitalInicialGlobal) * 100
            }
        };
    }
}

export const portfolioService = new PortfolioService();