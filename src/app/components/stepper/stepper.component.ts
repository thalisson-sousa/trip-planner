import { TravelService } from './../../services/travel.service';
import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { OrderListModule } from 'primeng/orderlist';
import { Image } from 'primeng/image';
import { ScrollerModule } from 'primeng/scroller';
import { AccordionModule } from 'primeng/accordion';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { Dialog } from 'primeng/dialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Attraction } from '../../types/Attraction';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    ButtonModule,
    StepperModule,
    InputTextModule,
    FloatLabel,
    DatePickerModule,
    FluidModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    Image,
    FormsModule,
    OrderListModule,
    ScrollerModule,
    AccordionModule,
    IftaLabelModule,
    InputNumberModule,
    Dialog,
    ToastModule,
    ConfirmPopupModule,
    CommonModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class StepperComponent {
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;
  editedAttraction: Attraction = {
    id: 0,
    nome: '',
    valor: 0,
    pagadorId: {
      id: Number(localStorage.getItem('userId')) || 0,
      nome: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
    },
    isAttraction: true,
  };

  editedId: string | null = null;
  editedIndex: number = -1;

  attractionInput = new FormControl('');
  GastoNome = new FormControl('');
  GastoPreco = new FormControl<number | null>(null);

  // Gere um id único (simples)
  private generateId(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }

  travelForm = new FormGroup({
    criador: new FormGroup({
      id: new FormControl<number | null>(
        Number(localStorage.getItem('userId'))
      ),
    }),
    nome: new FormControl<string | null>(null),
    destino: new FormControl<string | null>(null),
    url: new FormControl<string | null>(null),
    dataInicio: new FormControl<Date | null>(null),
    dataFim: new FormControl<Date | null>(null),
    status: new FormControl<string | null>('Em Planejamento'),
    gastos: this.formBuilder.array<FormControl<Attraction | null>>([]),
    atividades: this.formBuilder.array<FormControl<Attraction | null>>([]),
    totalGastos: new FormControl<number | null>(null),
  });

  editForm = this.formBuilder.group({
    nome: new FormControl<string | null>(null),
    valor: new FormControl<number | null>(null),
  });

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private TravelService: TravelService,
    private route: Router
  ) {}

  get atracao(): FormArray<FormControl<Attraction | null>> {
    return this.travelForm.get('atividades') as FormArray<
      FormControl<Attraction | null>
    >;
  }

  get gastos(): FormArray<FormControl<Attraction | null>> {
    return this.travelForm.get('gastos') as FormArray<
      FormControl<Attraction | null>
    >;
  }

  // Getter que transforma os valores do FormArray em uma lista utilizável no OrderList
  get atracoesList(): Attraction[] {
    return this.atracao.controls
      .map((control) => control.value)
      .filter((value): value is Attraction => value !== null);
  }

  get gastosList(): Attraction[] {
    return this.gastos.controls
      .map((control) => control.value)
      .filter((value): value is Attraction => value !== null);
  }

  addAttraction() {
    const nome = this.attractionInput.value?.trim();
    const valor = 0;
    if (nome) {
      const novaAtracao: Attraction = {
        id: this.generateId(),
        nome,
        valor,
        isAttraction: true,
      };
      this.atracao.push(this.formBuilder.control(novaAtracao));
      this.attractionInput.reset();
      this.updateTotalGastos(); // Atualiza total
    }
  }

  calcAllCoasts(): number {
    const attractionsTotal = this.atracoesList.reduce(
      (total, attraction) => total + (attraction.valor || 0),
      0
    );

    const gastosTotal = this.gastosList.reduce(
      (total, gasto) => total + (gasto.valor || 0),
      0
    );

    return attractionsTotal + gastosTotal;
  }

  // Função para atualizar o campo totalGastos do formulário
  updateTotalGastos() {
    const total = this.calcAllCoasts();
    this.travelForm.get('totalGastos')?.setValue(total);
  }

  removeAttraction(index: number): void {
    this.atracao.removeAt(index);
    this.updateTotalGastos(); // Atualiza total
  }

  // Atualiza o FormArray conforme a nova ordem no OrderList
  syncFormArray() {
    const novosControles = this.atracoesList.map((item) =>
      this.formBuilder.control(item as Attraction)
    );
    this.travelForm.setControl(
      'gastos',
      this.formBuilder.array<FormControl<Attraction | null>>(novosControles)
    );
  }

  // Método para adicionar um gasto de Passagens e Hospedagem
  addGasto() {
    const nome = this.GastoNome.value?.trim();
    const valor = this.GastoPreco.value ?? 0;
    if (nome) {
      const novaPassagem: any = {
        id: this.generateId(),
        nome,
        valor,
        pagador: {
          id: Number(localStorage.getItem('userId')) || 0,
        },
        isAttraction: false,
      };
      this.gastos.push(this.formBuilder.control(novaPassagem));
      this.GastoNome.reset();
      this.GastoPreco.reset();
      this.updateTotalGastos(); // Atualiza total
    }
  }

  editMode: 'attraction' | 'gasto' | null = null;

  // Método para editar uma atração existente
  editAttraction(id: string) {
    const attraction = this.getAttractionData(id);
    if (attraction) {
      this.editedAttraction = { ...attraction };
      this.editedId = id;
      this.editForm.patchValue({
        nome: attraction.nome,
        valor: attraction.valor,
      });
      this.editMode = 'attraction'; // <--- Aqui!
      this.showDialog();
    }
  }

  // Método para editar um gasto existente
  editGasto(id: string) {
    const gasto = this.gastosList.find((g) => g.id === Number(id));
    if (gasto) {
      this.editedAttraction = { ...gasto };
      this.editedId = id;
      this.editForm.patchValue({
        nome: gasto.nome,
        valor: gasto.valor,
      });
      this.editMode = 'gasto'; // <--- Aqui!
      this.showDialog();
    }
  }

  onSaveEdit() {
    if (this.editMode === 'attraction') {
      this.saveAttraction();
    } else if (this.editMode === 'gasto') {
      this.saveGasto();
    }
  }

  // Método para salvar as alterações de uma atração
  saveAttraction() {
    if (this.editedId && this.editForm.valid) {
      const index = this.atracao.controls.findIndex(
        (ctrl) => ctrl.value?.id === Number(this.editedId)
      );
      if (index !== -1) {
        const updated = {
          ...this.atracao.at(index).value,
          ...this.editForm.value,
        } as Attraction;
        this.atracao.at(index).setValue(updated);
        this.updateTotalGastos(); // Atualiza total
      }
      this.visible = false;
    }
  }

  // Método para salvar as alterações de um gasto
  saveGasto() {
    if (this.editedId && this.editForm.valid) {
      const index = this.gastos.controls.findIndex(
        (ctrl) => ctrl.value?.id === Number(this.editedId)
      );
      if (index !== -1) {
        const updated = {
          ...this.gastos.at(index).value,
          ...this.editForm.value,
        } as Attraction;
        this.gastos.at(index).setValue(updated);
        this.updateTotalGastos(); // Atualiza total
      }
      this.visible = false;
    }
  }

  getAttractionData(id: string): Attraction | null {
    return this.atracoesList.find((a) => a.id === Number(id)) || null;
  }

  // Método para exibir o diálogo de edição

  showDialog() {
    this.visible = true;
  }

  //PopUp de confirmação para deletar um item da aba roteiro
  deleteItem(event: Event, id: string) {
    const index = this.atracao.controls.findIndex(
      (ctrl) => ctrl.value?.id === Number(id)
    );
    if (index === -1) return; // Não encontrou o item

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Gostaria de deletar este item?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      },
      accept: () => {
        this.removeAttraction(index);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Item deletado',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Operação cancelada pelo Usuario!',
          life: 3000,
        });
      },
    });
  }

  UpdateCustos(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Essa ação irá atualizar os custos da viagem. Deseja continuar?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        // chamar função paa atualizar os custos
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Item Atualizado',
          life: 3000,
        });
        this.visible = false;
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Operação cancelada pelo Usuario!',
          life: 3000,
        });
      },
    });
  }

  addTravel() {
    if (this.travelForm.valid) {
      // console.log('Form Submitted', this.travelForm.value);

      this.TravelService.newTravel(this.travelForm.value).subscribe({
        next: (response) => {
          // console.log('Viagem adicionada com sucesso:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Viagem adicionada com sucesso!',
            detail: 'Sua viagem foi salva.',
          });
        },
        error: (error) => {
          console.error('Erro ao adicionar viagem:', error);
        },
      });

      // Redirecionar para a página de viagens
      setTimeout(() => {
        this.travelForm.reset(); // Reseta o formulário após salvar
        this.route.navigate(['/travels']);
      }, 2000); // Atraso de 2 segundo para garantir que a mensagem

    } else {
      console.log('Form is invalid');
    }
  }
}
