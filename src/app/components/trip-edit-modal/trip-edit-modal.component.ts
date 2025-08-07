import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';

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
import { Dialog } from 'primeng/dialog';
import { TravelService } from '../../services/travel.service';
import { Atividade, Gasto, TripData } from '../../types/TripData';

// Interface para os dados da viagem (boa prática)

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
    ToastModule,
    Dialog,
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class TripEditModalComponent implements OnInit {

  tripData!: TripData;

  timeModal: boolean = false;
  gastoEditModal: boolean = false;
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

  statusOptions = [
    { label: 'Em Planejamento', value: 'Em Planejamento' },
    { label: 'Em Andamento', value: 'Em Andamento' },
    { label: 'Concluída', value: 'Concluída' },
    { label: 'Cancelada', value: 'Cancelada' },
  ];

  newParticipantName: string = '';
  newExpense = { nome: '', valor: null as number | null };
  editedExpense = { nome: '', valor: null as number | null };

  calendarDays: Date[] = [];
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  draggedActivity: Atividade | null = null;

  constructor(
    private messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private travelService: TravelService,
  ) {}

  ngOnInit() {
    // Recebe os dados passados pelo DialogService e cria uma cópia profunda
    if (this.config.data && this.config.data.trip) {
      this.tripData = JSON.parse(JSON.stringify(this.config.data.trip));
      this.tripData.criador = localStorage.getItem('userId') ? { id: parseInt(localStorage.getItem('userId')!), nomeCriador: localStorage.getItem('userName') || '' } : { id: 0, nomeCriador: '' };

      // atualizar a propriedade viagem de cada atividade colocando o id da viagem com o valor do tripData.id
      this.tripData.atividades.forEach(atividade => {
        atividade.viagem = { id: this.tripData.id };
      });

    }

    this.generateCalendar();
  }

  nextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  CloseModal() {
    this.ref.close();
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
      this.scheduledDay = day;
      this.scheduledActivity = this.draggedActivity;
      this.scheduledTime.setValue(''); // Limpa o campo de horário
      this.timeModal = true; // Abre o modal
      this.draggedActivity = null; // Limpa o drag
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

    // Aqui você pode fazer uma requisição HTTP para atualizar os dados no servidor, se necessário
    // Exemplo:
    this.travelService.putTravels(this.tripData).subscribe({
      next: (updatedTrip) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Viagem atualizada com sucesso!' });
        console.log('Viagem atualizada:', this.tripData);
        this.ref.close(updatedTrip); // Fecha o modal e retorna a viagem atualizada
      }
      ,
      error: (error) => {
        console.log('Viagem atualizada:', this.tripData);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar a viagem.' });
      }
    });
  }

  saveScheduledTime() {
    if (this.scheduledDay && this.scheduledActivity) {
      const time = this.scheduledTime.value;
      if (time && /^\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(this.scheduledDay);
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
        // Atualiza a atividade
        const activityIndex = this.tripData.atividades.findIndex(a => a.id === this.scheduledActivity!.id);
        if (activityIndex !== -1) {
          this.tripData.atividades[activityIndex].dataHora = newDate.toISOString();
        }
        this.messageService.add({ severity: 'info', summary: 'Agendado', detail: `${this.scheduledActivity.nome} agendado para ${time}.` });
        this.timeModal = false;
        this.scheduledDay = null;
        this.scheduledActivity = null;
        this.scheduledTime.setValue('');
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formato de hora inválido.' });
      }
    }
  }

  editExpense(gasto: Gasto) {
    this.gastoEditModal = true;
    this.editedExpense.nome = gasto.nome;
    this.editedExpense.valor = gasto.valor;
    // Aqui você pode adicionar lógica para editar o gasto, como abrir um modal com os detalhes
  }

  saveExpense() {
    if (this.editedExpense.nome && this.editedExpense.valor && this.editedExpense.valor > 0) {
      const gastoIndex = this.tripData.gastos.findIndex(g => g.nome === this.editedExpense.nome);
      if (gastoIndex !== -1) {
        this.tripData.gastos[gastoIndex].nome = this.editedExpense.nome;
        this.tripData.gastos[gastoIndex].valor = this.editedExpense.valor;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Gasto editado!' });
        this.gastoEditModal = false;
        this.editedExpense = { nome: '', valor: null };
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Gasto não encontrado.' });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos corretamente.' });
    }
  }
}

