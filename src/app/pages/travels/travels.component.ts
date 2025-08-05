import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TravelService } from './../../services/travel.service';
import { Trip } from '../../types/Trip';
import { TripDetailModalComponent } from '../../components/trip-detail-modal/trip-detail-modal.component';
import { TripEditModalComponent } from '../../components/trip-edit-modal/trip-edit-modal.component';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    ChipModule
  ],
  templateUrl: './travels.component.html',
  styleUrl: './travels.component.scss',
  providers: [DialogService]
})
export class TravelsComponent {
  trips: Trip[] = [];
  initialTrips$: Trip[] = [];

  filterOptions: string[] = ['Todas', 'Próxima Viagem', 'Em Planejamento', 'Concluída'];
  selectedFilter: string = 'Todas';

  sortOptions: string[] = ['Mais Recentes', 'Mais Antigas'];
  selectedSort: string = 'Mais Recentes';

  ref: DynamicDialogRef | undefined;

  constructor(
    private service: TravelService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.service.getTravels().subscribe((trips: Trip[]) => {
      this.initialTrips$ = trips;
      this.applyFiltersAndSort();
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Próxima Viagem':
        return 'info';
      case 'Em Planejamento':
        return 'success';
      case 'Concluída':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  applyFiltersAndSort() {
    let filtered = [...this.initialTrips$];

    if (this.selectedFilter !== 'Todas') {
      filtered = filtered.filter(trip => trip.status === this.selectedFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dataInicio);
      const dateB = new Date(b.dataInicio);

      if (this.selectedSort === 'Mais Recentes') {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    this.trips = filtered;
  }

  showTripDetails(trip: Trip) {
    this.ref = this.dialogService.open(TripDetailModalComponent, {
      header: 'Detalhes da Viagem',
      width: '80vw',
      modal: true,
      data: { trip: { ...trip } },
      styleClass: 'custom-modal-dialog'
    });
  }

  showTripEdit(trip: Trip) {
    this.ref = this.dialogService.open(TripEditModalComponent, {
      header: 'Editar Viagem',
      width: '60vw',
      modal: true,
      data: { trip: { ...trip } },
      styleClass: 'custom-modal-dialog'
    });

    this.ref.onClose.subscribe((editedTrip: Trip) => {
      if (editedTrip) {
        const index = this.initialTrips$.findIndex(t => t.id === editedTrip.id);
        if (index !== -1) {
          this.initialTrips$[index] = editedTrip;
          this.applyFiltersAndSort();
        }
      }
    });
  }
}
