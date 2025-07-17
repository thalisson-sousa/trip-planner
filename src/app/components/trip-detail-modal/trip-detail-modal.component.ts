import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Trip } from '../../types/Trip';

@Component({
  selector: 'app-trip-detail-modal',
  templateUrl: './trip-detail-modal.component.html',
  styleUrls: ['./trip-detail-modal.component.scss'],
  standalone: true, // Marcar como standalone
  imports: [CommonModule, ButtonModule, ChipModule] // Importar módulos necessários
})
export class TripDetailModalComponent implements OnInit {
  trip: Trip | undefined;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {}

  ngOnInit() {
    this.trip = this.config.data.trip;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Próxima Viagem':
        return 'info';
      case 'Em Planeamento':
        return 'success';
      case 'Concluída':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  closeModal() {
    this.ref.close();
  }
}
