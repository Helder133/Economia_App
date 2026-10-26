import { Component, OnInit, signal } from '@angular/core';
import { ResumenPortafolioRespuesta } from '../../models/portafolio.model';
import { PortafolioService } from '../../services/portafolio.service';
import { BaseChartDirective } from 'ng2-charts';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-inversiones',
  imports: [ReactiveFormsModule, BaseChartDirective, CurrencyPipe, NgClass, DecimalPipe, CommonModule],
  templateUrl: './dashboard-inversiones.component.html',
  styleUrl: './dashboard-inversiones.component.css',
})
export class DashboardInversionesComponent {
  resumen = signal<ResumenPortafolioRespuesta | null>(null);
  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);
  formulario: FormGroup;

  // Configuración de la Gráfica
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = { responsive: true };

  constructor(private fb: FormBuilder, private portafolioService: PortafolioService) {
    this.formulario = this.fb.group({
      fechaCompra: ['2026-07-31', Validators.required],
      fechaRevision: ['2026-10-23', Validators.required],
      capitalInicialGlobal: [1000005, [Validators.required, Validators.min(1)]],
      inversiones: this.fb.array([
        // Inversiones iniciales 
        this.crearInversionFormGroup('U.S. Oil Fund', 'USO', 387.09),
        this.crearInversionFormGroup('Global X Uranium', 'URA', 4095.21),
        this.crearInversionFormGroup('Invesco Australian Dollar', 'FXA', 1434.10),
        this.crearInversionFormGroup('Nvidia', 'NVDA', 597.76),
        this.crearInversionFormGroup('Tesla', 'TSLA', 257.06),
        this.crearInversionFormGroup('Spdr Gold Shares', 'GLD', 269.15),
        this.crearInversionFormGroup('Invesco Yen Trust', 'FXY', 867.15),
        this.crearInversionFormGroup('Ishares Short Treasury Bond', 'SHV', 905.80),
        this.crearInversionFormGroup('Walmart', 'WMT', 1079.14),
        this.crearInversionFormGroup('Johnson & Johnson', 'JNJ', 468.11)
        

        // 1. PROPUESTA DEFENSIVA
        /*
        this.crearInversionFormGroup('SPDR Gold Shares', 'GLD', 269.17),
        this.crearInversionFormGroup('iShares Silver Trust', 'SLV', 1909.85),
        this.crearInversionFormGroup('Invesco Yen Trust', 'FXY', 1734.30),
        this.crearInversionFormGroup('Invesco Swiss Franc Trust', 'FXF', 917.09),
        this.crearInversionFormGroup('iShares Short Treasury Bond', 'SHV', 905.79),
        this.crearInversionFormGroup('Walmart', 'WMT', 899.28),
        this.crearInversionFormGroup('Procter & Gamble', 'PG', 692.08),
        this.crearInversionFormGroup('Johnson & Johnson', 'JNJ', 390.09),
        this.crearInversionFormGroup('NextEra Energy', 'NEE', 1150.48),
        this.crearInversionFormGroup('Coca-Cola', 'KO', 1141.68)
        */

        // 2. PROPUESTA AGRESIVA
        /*
        this.crearInversionFormGroup('U.S. Oil Fund', 'USO', 774.22),
        this.crearInversionFormGroup('Global X Uranium', 'URA', 2559.50),
        this.crearInversionFormGroup('Invesco Australian Dollar', 'FXA', 1434.10),
        this.crearInversionFormGroup('Invesco Euro Trust', 'FXE', 939.05),
        this.crearInversionFormGroup('Nvidia', 'NVDA', 498.13),
        this.crearInversionFormGroup('Tesla', 'TSLA', 321.32),
        this.crearInversionFormGroup('MicroStrategy', 'MSTR', 1072.04),
        this.crearInversionFormGroup('Palantir', 'PLTR', 812.60),
        this.crearInversionFormGroup('Coinbase', 'COIN', 683.71),
        this.crearInversionFormGroup('Super Micro Computer', 'SMCI', 3521.12)
        */

        
        // 3. PROPUESTA 40% RIESGO / 60% ESTABILIDAD (8.01%)
        /*
        this.crearInversionFormGroup('U.S. Oil Fund', 'USO', 774.17),
        this.crearInversionFormGroup('Invesco Australian Dollar', 'FXA', 1434.10),
        this.crearInversionFormGroup('Nvidia', 'NVDA', 498.13),
        this.crearInversionFormGroup('Tesla', 'TSLA', 321.32),
        this.crearInversionFormGroup('SPDR Gold Shares', 'GLD', 269.14),
        this.crearInversionFormGroup('Invesco Yen Trust', 'FXY', 1734.30),
        this.crearInversionFormGroup('iShares Short Treasury Bond', 'SHV', 905.79),
        this.crearInversionFormGroup('Walmart', 'WMT', 899.28),
        this.crearInversionFormGroup('Johnson & Johnson', 'JNJ', 390.09),
        this.crearInversionFormGroup('Procter & Gamble', 'PG', 692.08)
        */
        
        // 4. PROPUESTA 30% RIESGO / 70% ESTABILIDAD (6.86%)
        /*
        this.crearInversionFormGroup('U.S. Oil Fund', 'USO', 774.25),
        this.crearInversionFormGroup('Invesco Australian Dollar', 'FXA', 1434.10),
        this.crearInversionFormGroup('Nvidia', 'NVDA', 498.13),
        this.crearInversionFormGroup('SPDR Gold Shares', 'GLD', 269.14),
        this.crearInversionFormGroup('Invesco Yen Trust', 'FXY', 1734.30),
        this.crearInversionFormGroup('iShares Short Treasury Bond', 'SHV', 905.79),
        this.crearInversionFormGroup('Walmart', 'WMT', 899.28),
        this.crearInversionFormGroup('Johnson & Johnson', 'JNJ', 390.09),
        this.crearInversionFormGroup('Procter & Gamble', 'PG', 692.08),
        this.crearInversionFormGroup('Coca-Cola', 'KO', 1141.68)
        */
      ])
    });
  }

  get inversionesArray(): FormArray {
    return this.formulario.get('inversiones') as FormArray;
  }

  crearInversionFormGroup(empresa = '', ticker = '', cantidad = 1): FormGroup {
    return this.fb.group({
      empresa: [empresa, Validators.required],
      ticker: [ticker, Validators.required],
      cantidad: [cantidad, [Validators.required, Validators.min(0.01)]] // min 0.01 para permitir decimales
    });
  }

  agregarInversion() {
    this.inversionesArray.push(this.crearInversionFormGroup());
  }

  removerInversion(index: number) {
    this.inversionesArray.removeAt(index);
  }

  calcularPortafolio() {
    if (this.formulario.invalid) return;
    this.cargando.set(true);

    this.portafolioService.calcularResumen(this.formulario.value).subscribe({
      next: (data) => {
        this.mensajeError.set(null);
        this.resumen.set(data);
        this.actualizarGrafica(data.historialGrafica);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        const msj = err.error?.mensaje || 'Error de conexión con el servidor.';
        this.mensajeError.set(msj);
        this.cargando.set(false);
      }
    });
  }

  actualizarGrafica(historial: { fecha: string; valor: number }[]) {
    this.lineChartData = {
      labels: historial.map(h => h.fecha),
      datasets: [
        {
          data: historial.map(h => h.valor),
          label: 'Valor Total del Portafolio ($)',
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
}