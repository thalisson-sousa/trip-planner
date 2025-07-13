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
  styleUrl: './travels.component.scss'
})
export class TravelsComponent {

  // Dados de exemplo para as viagens
  initialTrips$: Trip[] = [];

  trips: Trip[] = []; // Viagens a serem exibidas após filtragem/ordenação
  filterOptions: string[] = ['Todas', 'Próxima Viagem', 'Em Planejamento', 'Concluída'];
  selectedFilter: string = 'Todas';
  sortOptions: string[] = ['Mais Recentes', 'Mais Antigas'];
  selectedSort: string = 'Mais Recentes';

  constructor(private service: TravelService) {}

  ngOnInit() {
    this.service.getTravels().subscribe((trips: Trip[]) => {
      this.initialTrips$ = trips;
      console.log('Viagens carregadas:', this.initialTrips$);
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
      const dateA = new Date(a.dataInicio.split('/').reverse().join('-'));
      const dateB = new Date(b.dataInicio.split('/').reverse().join('-'));

      if (this.selectedSort === 'Mais Recentes') {
        return dateB.getTime() - dateA.getTime();
      } else if (this.selectedSort === 'Mais Antigas') {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });

    this.trips = filtered;
  }

}
