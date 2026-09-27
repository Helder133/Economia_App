import { Component, OnInit, signal } from '@angular/core';
import { ResumenPortafolioRespuesta } from '../../models/portafolio.model';
import { PortafolioService } from '../../services/portafolio.service';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard-inversiones',
  imports: [CurrencyPipe, NgClass, DecimalPipe],
  templateUrl: './dashboard-inversiones.component.html',
  styleUrl: './dashboard-inversiones.component.css',
})
export class DashboardInversionesComponent implements OnInit {
  // Inicialización de Signals
  resumen = signal<ResumenPortafolioRespuesta | null>(null);
  cargando = signal<boolean>(true);

  constructor(private portafolioService: PortafolioService) { }

  ngOnInit(): void {
    this.obtenerDatosPortafolio();
  }

  obtenerDatosPortafolio(): void {
    const configuracionInicial = {
      fechaInicio: "2026-07-01",
      fechaFin: "2026-10-30",
      capitalInicialGlobal: 1000000,
      inversiones: [
        { empresa: "Apple", ticker: "AAPL", cantidad: 1000, precioCompra: 150.00 },
        { empresa: "Microsoft", ticker: "MSFT", cantidad: 500, precioCompra: 300.00 }
      ]
    };

    this.portafolioService.calcularResumen(configuracionInicial).subscribe({
      next: (data) => {
        this.resumen.set(data); // Actualizamos el valor del signal
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al conectar con Node.js:', err);
        this.cargando.set(false);
      }
    });
  }
}