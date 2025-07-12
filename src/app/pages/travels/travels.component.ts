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
  initialTrips: Trip[] = [
    {
      id: '1',
      nome: 'Férias na Europa',
      destino: 'Paris, Roma, Barcelona',
      dataInicio: '10/12/2025',
      dataFim: '20/12/2025',
      status: 'Em Planejamento',
      budget: 'R$ 15.000,00',
      imageUrl: 'https://placehold.co/400x200/4F46E5/ffffff?text=Europa',
    },
    {
      id: '2',
      nome: 'Nordeste Brasileiro',
      destino: 'Recife, Natal, Fortaleza',
      dataInicio: '15/01/2026',
      dataFim: '30/01/2026',
      status: 'Em Planejamento',
      budget: 'R$ 8.500,00',
      imageUrl: 'https://placehold.co/400x200/22C55E/ffffff?text=Nordeste',
    },
    {
      id: '3',
      nome: 'Feriado em Gramado',
      destino: 'Gramado, Canela',
      dataInicio: '12/06/2025',
      dataFim: '15/06/2025',
      status: 'Concluída',
      budget: 'R$ 3.200,00',
      imageUrl: 'https://placehold.co/400x200/EF4444/ffffff?text=Gramado',
    },
    {
      id: '4',
      nome: 'Aventura na Patagónia',
      destino: 'Bariloche, El Calafate',
      dataInicio: '01/03/2026',
      dataFim: '15/03/2026',
      status: 'Próxima Viagem',
      budget: 'R$ 12.000,00',
      imageUrl: 'https://placehold.co/400x200/F97316/ffffff?text=Patagónia',
    },
    {
      id: '5',
      nome: 'Viagem de Negócios - SP',
      destino: 'São Paulo',
      dataInicio: '20/07/2025',
      dataFim: '22/07/2025',
      status: 'Próxima Viagem',
      budget: 'R$ 2.500,00',
      imageUrl: 'https://placehold.co/400x200/0EA5E9/ffffff?text=São+Paulo',
    },
  ];

  trips: Trip[] = []; // Viagens a serem exibidas após filtragem/ordenação
  filterOptions: string[] = ['Todas', 'Próxima Viagem', 'Em Planejamento', 'Concluída'];
  selectedFilter: string = 'Todas';
  sortOptions: string[] = ['Mais Recentes', 'Mais Antigas'];
  selectedSort: string = 'Mais Recentes';

  ngOnInit() {
    // Inicializa as viagens ao carregar o componente
    this.applyFiltersAndSort();
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
    let filtered = [...this.initialTrips];

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
