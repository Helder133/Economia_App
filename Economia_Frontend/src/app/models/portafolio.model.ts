export interface Inversion {
    empresa: string;
    ticker: string;
    cantidad: number;
    precioCompra: number;
    precioActual: number;
    costoTotalCompra: number;
    valorActual: number;
    gananciaPerdidaDinero: number;
    gananciaPerdidaPorcentaje: number;
}

export interface CuentaGlobal {
    capitalInicial: number;
    totalUtilizadoEnAcciones: number;
    efectivoSobrante: number;
    valorFinalAcciones: number;
    valorFinalTotalPortafolio: number;
    rendimientoNetoDinero: number;
    rendimientoNetoPorcentaje: number;
}

export interface EstadisticasActivos {
    mejorAccion: { ticker: string; gananciaPorcentaje: number; gananciaDinero: number; };
    peorAccion: { ticker: string; gananciaPorcentaje: number; gananciaDinero: number; };
    rendimientoDiario: {
        mejorDia: { fecha: string; porcentaje: number; };
        peorDia: { fecha: string; porcentaje: number; };
    };
}

export interface ResumenPortafolioRespuesta {
    periodo: { inicio: string; fin: string };
    resumenIndividual: Inversion[];
    estadisticasActivos: EstadisticasActivos;
    cuentaGlobal: CuentaGlobal;
    historialGrafica: { fecha: string; valor: number }[];
}