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
import { CalendarComponent } from "../calendar/calendar.component";
import { Console } from 'console';


@Component({
  selector: 'app-trip-detail-modal',
  templateUrl: './trip-detail-modal.component.html',
  styleUrls: ['./trip-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, ChipModule, DialogModule, PanelModule, StepsModule, CalendarModule, CardModule, InputIconModule, TableModule, CalendarComponent]
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

  passeios: { id: number; nome: string; data: string; horario: string }[] = [];

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    // Recebe os dados passados pelo DialogService e cria uma cópia profunda
    if (this.config.data && this.config.data.trip) {
      this.tripData = JSON.parse(JSON.stringify(this.config.data.trip));

      // copiar as atividades para o arrey de passeios
      this.tripData?.atividades.forEach(atividade => {
        if (atividade.dataHora) {
          this.passeios.push({
            id: atividade.id ?? 0,
            nome: atividade.nome ?? 'Atividade Sem Nome',
            data: atividade.dataHora,
            horario: atividade.dataHora.split('T')[1].substring(0,5) // extrai o horário no formato "HH:MM"
          });
        }
      });
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
    if (this.draggedActivity && this.scheduledTime.value) {
      const newActivity: Atividade = {
        ...this.draggedActivity,
        dataHora: this.scheduledTime.value,
        viagemId: this.tripData?.id || 0,
      };
      this.tripData?.atividades.push(newActivity);
      this.draggedActivity = null;
      this.scheduledTime.setValue('');
      this.scheduledDay = null;
      this.scheduledActivity = null;
    }
  }

  getActivitiesForDay(day: Date): Atividade[] {
    const dayString = day.toISOString().split('T')[0];
    return this.tripData?.atividades?.filter(a => a.dataHora && a.dataHora.startsWith(dayString)) || [];
  }

  //teste

    getUnscheduledActivities(): Atividade[] {
      return this.tripData?.atividades.filter(activity => !activity.dataHora) || [];
    }

    dragStart(activity: Atividade) {
      this.draggedActivity = activity;
      this.scheduledActivity = activity;
      this.scheduledDay = null; // Reset scheduled day when starting drag
      this.scheduledTime.setValue(''); // Reset scheduled time when starting drag
    }

    dragEnd() {
      this.draggedActivity = null; // Clear the dragged activity when drag ends
      this.scheduledActivity = null; // Clear the scheduled activity when drag ends
      this.scheduledDay = null; // Clear the scheduled day when drag ends
      this.scheduledTime.setValue(''); // Clear the scheduled time when drag ends
    }
  }
