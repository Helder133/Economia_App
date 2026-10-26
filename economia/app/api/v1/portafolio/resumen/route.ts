import { InversionInput } from '@/app/models/invresion.models';
import { portfolioService } from '@/app/services/portafolio.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // CORRECCIÓN: Usar fechaCompra y fechaRevision en lugar de fechaInicio/fechaFin
        const { fechaCompra, fechaRevision, capitalInicialGlobal, inversiones } = body as {
            fechaCompra: string;
            fechaRevision: string;
            capitalInicialGlobal: number;
            inversiones: InversionInput[];
        };

        if (!capitalInicialGlobal || !inversiones || inversiones.length === 0) {
            return NextResponse.json(
                { mensaje: 'Faltan datos requeridos.' },
                { status: 400 }
            );
        }

        // Pasar las variables correctas al servicio
        const resultado = await portfolioService.procesarResumen(
            fechaCompra,
            fechaRevision,
            capitalInicialGlobal,
            inversiones
        );

        return NextResponse.json(resultado, { status: 200 });
    } catch (error: any) {
        console.error('Error procesando el portafolio:', error);

        // Extrae error.message para enviar la razón exacta al frontend
        return NextResponse.json(
            { mensaje: error.message || 'Error interno del servidor' },
            { status: 400 }
        );
    }
}