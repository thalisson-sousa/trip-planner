import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';

// Importações do PrimeNG para o componente Standalone
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DragDropModule } from 'primeng/dragdrop';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

// Interface para os dados da viagem (boa prática)
interface Atividade {
  id: number;
  viagemId: number;
  nome: string;
  descricao: string | null;
  valor: number;
  dataHora: string | null;
  status: string | null;
}

interface Gasto {
    id: number;
    viagemId: number;
    nome: string;
    valor: number;
    nomePagador: string;
    participantes: any[];
}

interface TripData {
    id: number;
    nome: string;
    destino: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    nomeCriador: string;
    participantes: { nome: string }[];
    atividades: Atividade[];
    gastos: Gasto[];
}

@Component({
  selector: 'app-trip-edit-modal',
  templateUrl: './trip-edit-modal.component.html',
  styleUrls: ['./trip-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    StepsModule,
    DragDropModule,
    PanelModule,
    DataViewModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class TripEditModalComponent implements OnInit {
  tripData!: TripData;

  steps: MenuItem[] = [
    { label: 'Info. Gerais' },
    { label: 'Participantes' },
    { label: 'Atividades' },
    { label: 'Gastos' },
    { label: 'Resumo' }
  ];
  activeIndex: number = 0;

  statusOptions = [
    { label: 'Em Planejamento', value: 'Em Planejamento' },
    { label: 'Confirmada', value: 'Confirmada' },
    { label: 'Em Andamento', value: 'Em Andamento' },
    { label: 'Finalizada', value: 'Finalizada' }
  ];

  newParticipantName: string = '';
  newExpense = { nome: '', valor: null as number | null };

  calendarDays: Date[] = [];
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  draggedActivity: Atividade | null = null;

  constructor(
    private messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    // Recebe os dados passados pelo DialogService e cria uma cópia profunda
    if (this.config.data && this.config.data.trip) {
      this.tripData = JSON.parse(JSON.stringify(this.config.data.trip));
    }
    this.generateCalendar();
  }

  nextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  addParticipant() {
    if (this.newParticipantName && !this.tripData.participantes.find(p => p.nome === this.newParticipantName)) {
      this.tripData.participantes.push({ nome: this.newParticipantName });
      this.newParticipantName = '';
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Participante adicionado!' });
    }
  }

  removeParticipant(participantName: string) {
    this.tripData.participantes = this.tripData.participantes.filter(p => p.nome !== participantName);
    this.messageService.add({ severity: 'warn', summary: 'Removido', detail: 'Participante removido.' });
  }

  generateCalendar() {
    this.calendarDays = [];
    if (this.tripData && this.tripData.dataInicio && this.tripData.dataFim) {
        const start = new Date(this.tripData.dataInicio + 'T00:00:00');
        const end = new Date(this.tripData.dataFim + 'T00:00:00');
        let current = new Date(start);
        while (current <= end) {
            this.calendarDays.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    }
  }

  getActivitiesForDay(day: Date): Atividade[] {
    const dayString = day.toISOString().split('T')[0];
    return this.tripData.atividades?.filter(a => a.dataHora && a.dataHora.startsWith(dayString)) || [];
  }

  getUnscheduledActivities(): Atividade[] {
    return this.tripData.atividades?.filter(a => !a.dataHora) || [];
  }

  dragStart(activity: Atividade) {
    this.draggedActivity = activity;
  }

  drop(day: Date) {
    if (this.draggedActivity) {
      const time = prompt("Atividade agendada! Qual horário? (HH:MM)", "09:00");
      if (time && /^\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(day);
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
        const activityIndex = this.tripData.atividades.findIndex(a => a.id === this.draggedActivity!.id);
        if(activityIndex !== -1) {
            this.tripData.atividades[activityIndex].dataHora = newDate.toISOString();
        }
        this.messageService.add({ severity: 'info', summary: 'Agendado', detail: `${this.draggedActivity.nome} agendado para ${time}.` });
        this.draggedActivity = null;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formato de hora inválido.' });
      }
    }
  }

  dragEnd() {
    this.draggedActivity = null;
  }

  addExpense() {
    if (this.newExpense.nome && this.newExpense.valor && this.newExpense.valor > 0) {
        this.tripData.gastos.push({
            id: Date.now(),
            viagemId: this.tripData.id,
            nome: this.newExpense.nome,
            valor: this.newExpense.valor,
            nomePagador: this.tripData.nomeCriador,
            participantes: []
        });
        this.newExpense = { nome: '', valor: null };
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Gasto adicionado!' });
    }
  }

  removeExpense(expenseId: number) {
    this.tripData.gastos = this.tripData.gastos.filter(g => g.id !== expenseId);
    this.messageService.add({ severity: 'warn', summary: 'Removido', detail: 'Gasto removido.' });
  }

  getTotalExpenses(): number {
    return this.tripData.gastos?.reduce((total, gasto) => total + gasto.valor, 0) || 0;
  }

  saveChanges() {
    this.messageService.add({ severity: 'success', summary: 'Salvo!', detail: 'As informações da viagem foram salvas.' });
    console.log('Dados da viagem salvos:', this.tripData);
    this.ref.close(this.tripData); // Fecha o modal e retorna os dados
  }
}
