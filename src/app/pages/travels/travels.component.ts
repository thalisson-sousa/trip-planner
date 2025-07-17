import { TravelService } from './../../services/travel.service';
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { CommonModule } from '@angular/common';


// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { Trip } from '../../types/Trip';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TripDetailModalComponent } from '../../components/trip-detail-modal/trip-detail-modal.component';
import { TripEditModalComponent } from '../../components/trip-edit-modal/trip-edit-modal.component';


@Component({
  selector: 'app-travels',
  imports: [
    CommonModule, // <-- Adicione aqui!
    FormsModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    ChipModule
  ],
  templateUrl: './travels.component.html',
  styleUrl: './travels.component.scss',
  providers: [DialogService] // Necessário para usar o DialogService
})
export class TravelsComponent {

  // Dados de exemplo para as viagens
  initialTrips$: Trip[] = [];

  trips: Trip[] = []; // Viagens a serem exibidas após filtragem/ordenação
  filterOptions: string[] = ['Todas', 'Próxima Viagem', 'Em Planejamento', 'Concluída'];
  selectedFilter: string = 'Todas';
  sortOptions: string[] = ['Mais Recentes', 'Mais Antigas'];
  selectedSort: string = 'Mais Recentes';

  ref: DynamicDialogRef | undefined; // Referência para o modal aberto

  constructor(private service: TravelService, public dialogService: DialogService) {}

  ngOnInit() {
    this.service.getTravels().subscribe((trips: Trip[]) => {
      this.initialTrips$ = trips;
      this.applyFiltersAndSort(); // Aplica filtros e ordenação após carregar as viagens
    });
  }

  // Retorna a cor do status para o PrimeNG Chip
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Próxima Viagem':
        return 'info'; // Azul
      case 'Em Planejamento':
        return 'success'; // Verde
      case 'Concluída':
        return 'danger'; // Vermelho
      default:
        return 'secondary'; // Cinza
    }
  }

  // Aplica filtros e ordenação às viagens
  applyFiltersAndSort() {
    let filtered = [...this.initialTrips$];

    // Filtragem
    if (this.selectedFilter !== 'Todas') {
      filtered = filtered.filter(trip => trip.status === this.selectedFilter);
    }

    // Ordenação
    filtered.sort((a, b) => {
      const dateA = new Date(
        (typeof a.dataInicio === 'string' ? a.dataInicio : a.dataInicio.toISOString().slice(0, 10).replace(/-/g, '/'))
          .split('/')
          .reverse()
          .join('-')
      );
      const dateB = new Date(
        (typeof b.dataInicio === 'string' ? b.dataInicio : b.dataInicio.toISOString().slice(0, 10).replace(/-/g, '/'))
          .split('/')
          .reverse()
          .join('-')
      );

      if (this.selectedSort === 'Mais Recentes') {
        return dateB.getTime() - dateA.getTime();
      } else if (this.selectedSort === 'Mais Antigas') {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });

    this.trips = filtered;
  }

    // Abre o modal de detalhes da viagem
  showTripDetails(trip: Trip) {
    this.ref = this.dialogService.open(TripDetailModalComponent, {
      header: 'Detalhes da Viagem',
      width: '50vw',
      modal: true,
      data: { trip: trip },
      styleClass: 'custom-modal-dialog' // Classe para estilização personalizada
    });
  }

  // Abre o modal de edição da viagem
  showTripEdit(trip: Trip) {
    this.ref = this.dialogService.open(TripEditModalComponent, {
      header: 'Editar Viagem',
      width: '60vw',
      modal: true,
      data: { trip: { ...trip } }, // Passa uma cópia para evitar modificações diretas
      styleClass: 'custom-modal-dialog' // Classe para estilização personalizada
    });

    // Opcional: Lidar com o resultado do modal de edição
    this.ref.onClose.subscribe((editedTrip: Trip) => {
      if (editedTrip) {
        // Encontra a viagem original e a atualiza
        const index = this.initialTrips$.findIndex(t => t.id === editedTrip.id);
        if (index !== -1) {
          this.initialTrips$[index] = editedTrip;
          this.applyFiltersAndSort(); // Reaplicar filtros e ordenação após a edição
        }
      }
    });
  }

}
