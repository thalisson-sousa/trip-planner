import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber'; // Para o orçamento
import { Trip } from '../../types/Trip';

@Component({
  selector: 'app-trip-edit-modal',
  templateUrl: './trip-edit-modal.component.html',
  styleUrls: ['./trip-edit-modal.component.scss'],
  standalone: true, // Marcar como standalone
  imports: [
    CommonModule,
    FormsModule, // Necessário para ngModel
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule
  ]
})
export class TripEditModalComponent implements OnInit {
  editedTrip: Trip | undefined;
  statusOptions: string[] = ['Próxima Viagem', 'Em Planeamento', 'Concluída'];

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {}

  ngOnInit() {
    // Cria uma cópia profunda para evitar modificar o objeto original diretamente
    this.editedTrip = { ...this.config.data.trip };

    // Converte as datas de string para objeto Date para o p-calendar
    if (this.editedTrip?.dataInicio) {
      this.editedTrip.dataInicio = new Date(this.editedTrip.dataInicio);
    }
    if (this.editedTrip?.dataFim) {
      this.editedTrip.dataFim = new Date(this.editedTrip.dataFim);
    }
  }

  saveChanges() {
    if (this.editedTrip) {
      // Converte as datas de volta para string no formato original
      const savedTrip = { ...this.editedTrip };
      if (savedTrip.dataInicio && typeof savedTrip.dataInicio !== 'string') {
        savedTrip.dataInicio = (savedTrip.dataInicio as Date).toLocaleDateString('pt-BR');
      }
      if (savedTrip.dataFim && typeof savedTrip.dataFim !== 'string') {
        savedTrip.dataFim = (savedTrip.dataFim as Date).toLocaleDateString('pt-BR');
      }
      // Converte orçamento de número para string no formato original
      if (typeof savedTrip.totalGastos === 'number') {
        savedTrip.totalGastos = `R$ ${(savedTrip.totalGastos as number).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      this.ref.close(savedTrip); // Retorna a viagem editada
    }
  }

  cancelEdit() {
    this.ref.close(null); // Fecha sem retornar dados
  }
}
