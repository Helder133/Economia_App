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

export interface ResumenPortafolioRespuesta {
    periodo: { inicio: string; fin: string };
    resumenIndividual: Inversion[];
    cuentaGlobal: CuentaGlobal;
}