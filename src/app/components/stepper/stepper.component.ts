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
  providers: [ConfirmationService, MessageService]
})
export class StepperComponent {

  private formBuilder = inject(FormBuilder);
  visible: boolean = false;
  editedAttraction: Attraction = {
  id: '',
  nome: '',
  preco: 0 ,
  isAttraction: true
};

  editedId: string | null = null;
  editedIndex: number = -1;

  attractionInput = new FormControl('');
  GastoNome = new FormControl('');
  GastoPreco = new FormControl<number | null>(null);

  // Gere um id único (simples)
  private generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now();
  }

  travelForm = new FormGroup({
    destino: new FormControl<string | null>(null),
    url: new FormControl<string | null>(null),
    dataInicio: new FormControl<Date | null>(null),
    dataFim: new FormControl<Date | null>(null),
    gastos: this.formBuilder.array<FormControl<Attraction | null>>([]),
    totalGastos: new FormControl<number | null>(null),
  });

  editForm = this.formBuilder.group({
  nome: new FormControl<string | null>(null),
  preco: new FormControl<number | null>(null),
});


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

    get atracao(): FormArray<FormControl<Attraction | null>> {
    return this.travelForm.get('gastos') as FormArray<FormControl<Attraction | null>>;
  }

  // Getter que transforma os valores do FormArray em uma lista utilizável no OrderList
  get atracoesList(): Attraction[] {
    return this.atracao.controls
      .map((control) => control.value)
      .filter((value): value is Attraction => value !== null);
  }

  addAttraction() {
    const nome = this.attractionInput.value?.trim();
    const preco = 0;
    if (nome) {
      const novaAtracao: Attraction = { id: this.generateId(), nome, preco, isAttraction: true };
      this.atracao.push(this.formBuilder.control(novaAtracao));
      this.attractionInput.reset();
      this.updateTotalGastos(); // Atualiza total
    }
  }

  calcAllCoasts(): number {
    return this.atracoesList.reduce((total, attraction) => total + (attraction.preco || 0), 0);
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

  addTravel() {
    if (this.travelForm.valid) {
      console.log('Form Submitted', this.travelForm.value);
      this.travelForm.reset();
      this.atracao.clear();
    } else {
      console.log('Form is invalid');
    }
  }

  // Método para adicionar um gasto de Passagens e Hospedagem
  addGasto() {
    const nome = this.GastoNome.value?.trim();
    const preco = this.GastoPreco.value ?? 0;
    if (nome) {
      const novaPassagem: Attraction = { id: this.generateId(), nome, preco, isAttraction: false };
      this.atracao.push(this.formBuilder.control(novaPassagem));
      this.GastoNome.reset();
      this.GastoPreco.reset();
      this.updateTotalGastos(); // Atualiza total
    }
  }

  // Método para editar uma atração existente
  editAttraction(id: string) {
  const attraction = this.getAttractionData(id);
  if (attraction) {
    this.editedAttraction = { ...attraction };
    this.editedId = id;

    this.editForm.patchValue({
      nome: attraction.nome,
      preco: attraction.preco,
    });

    this.showDialog();
  }
}


    // Método para salvar as alterações de uma atração
    saveAttraction() {
      if (this.editedId && this.editForm.valid) {
        const index = this.atracao.controls.findIndex(
          (ctrl) => ctrl.value?.id === this.editedId
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


    getAttractionData(id: string): Attraction | null {
    return this.atracoesList.find((a) => a.id === id) || null;
  }

    // Método para exibir o diálogo de edição

  showDialog() {
        this.visible = true;
    }

    //PopUp de confirmação para deletar um item da aba roteiro
    deleteItem(event: Event, id: string) {
    const index = this.atracao.controls.findIndex(ctrl => ctrl.value?.id === id);
    if (index === -1) return; // Não encontrou o item

    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Gostaria de deletar este item?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Deletar',
            severity: 'danger'
        },
        accept: () => {
            this.removeAttraction(index);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Item deletado', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Operação cancelada pelo Usuario!', life: 3000 });
        }
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
                outlined: true
            },
            acceptButtonProps: {
                label: 'Confirmar',
            },
            accept: () => {
                // chamar função paa atualizar os custos
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Item Atualizado', life: 3000 });
                this.visible = false;
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Operação cancelada pelo Usuario!', life: 3000 });
            }
        });
    }

}
