import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Atividade, Travel } from '../../types/TripResonse';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputIconModule } from 'primeng/inputicon';
import { FormControl } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-trip-detail-modal',
  templateUrl: './trip-detail-modal.component.html',
  styleUrls: ['./trip-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, ChipModule, DialogModule, PanelModule, StepsModule, CalendarModule, CardModule, InputIconModule, TableModule]
})
export class TripDetailModalComponent implements OnInit {
  tripData: Travel | undefined;

  calendarDays: Date[] = [];
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  draggedActivity: Atividade | null = null;

  scheduledTime = new FormControl('');
  scheduledDay: Date | null = null;
  scheduledActivity: Atividade | null = null;

  steps: MenuItem[] = [
    { label: 'Info. Gerais' },
    { label: 'Participantes' },
    { label: 'Atividades' },
    { label: 'Gastos' },
    { label: 'Resumo' }
  ];
  activeIndex: number = 0;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    // Recebe os dados passados pelo DialogService e cria uma cópia profunda
    if (this.config.data && this.config.data.trip) {
      this.tripData = JSON.parse(JSON.stringify(this.config.data.trip));
    }
  }

  closeModal() {
    this.ref.close();
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

  get totalGastos(): number {
    return this.tripData?.gastos?.reduce((sum, g) => sum + g.valor, 0) || 0;
  }

  drop(day: Date) {
    if (this.draggedActivity) {
      this.scheduledDay = day;
      this.scheduledActivity = this.draggedActivity;
      this.scheduledTime.setValue(''); // Limpa o campo de horário
      this.tripData?.atividades.push({
        ...this.draggedActivity,
        dataHora: `${day.toISOString().split('T')[0]}T${this.scheduledTime.value || '00:00:00'}`,
      });
      this.draggedActivity = null; // Limpa o drag
    }
  }

  getActivitiesForDay(day: Date): Atividade[] {
    const dayString = day.toISOString().split('T')[0];
    return this.tripData?.atividades.filter(activity =>
      activity.dataHora?.startsWith(dayString)) || [];
  }

}
