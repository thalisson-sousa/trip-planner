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
    IftaLabelModule ,
    InputNumberModule,
    Dialog,
    ToastModule,
    ConfirmPopupModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class StepperComponent {

  private formBuilder = inject(FormBuilder);
  visible: boolean = false;
  editedAttraction: { nome: string; preco: number } | null = null;
  editedIndex: number = -1;

  attractionInput = new FormControl('');

  travelForm = new FormGroup({
    nome: new FormControl<string | null>(null),
    url: new FormControl<string | null>(null),
    dataInicio: new FormControl<Date | null>(null),
    dataFim: new FormControl<Date | null>(null),
    destino: new FormControl<string | null>(null),
    gastos: this.formBuilder.array<FormControl<{ nome: string; preco: number } | null>>([]),
  });

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  get atracao(): FormArray<
    FormControl<{ nome: string; preco: number } | null>
  > {
    return this.travelForm.get('gastos') as FormArray<
      FormControl<{ nome: string; preco: number } | null>
    >;
  }

  // Getter que transforma os valores do FormArray em uma lista utilizável no OrderList
  get atracoesList(): { nome: string; preco: number }[] {
    return this.atracao.controls
      .map((control) => control.value)
      .filter(
        (value): value is { nome: string; preco: number } => value !== null
      );
  }

  addAttraction() {
    const nome = this.attractionInput.value?.trim();
    const preco = 0;

    if (nome) {
      const novaAtracao = { nome, preco };
      this.atracao.push(this.formBuilder.control(novaAtracao));
      this.attractionInput.reset();
    }
  }

  removeAttraction(index: number): void {
    this.atracao.removeAt(index);
  }

  // Atualiza o FormArray conforme a nova ordem no OrderList
  syncFormArray() {
    const novosControles = this.atracoesList.map((item) =>
      this.formBuilder.control(item)
    );
    this.travelForm.setControl(
      'gastos',
      this.formBuilder.array<
        FormControl<{ nome: string; preco: number } | null>
      >(novosControles)
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

    // Método para editar uma atração existente
    editAttraction(attraction: { nome: string; preco: number }, index: number) {
        this.editedAttraction = { ...attraction };
        this.editedIndex = index;
        this.showDialog();
        console.log(index)
    }

    // Método para salvar as alterações de uma atração
    saveAttraction() {
        if (this.editedAttraction && this.editedIndex >= 0) {
            this.atracao.at(this.editedIndex).setValue(this.editedAttraction);
            this.editedAttraction = null;
            this.editedIndex = -1;
            this.visible = false;
        }
    }

    getAttractionData(index: number): { nome: string; preco: number } {
      const attraction = this.atracao.at(index).value;
      return attraction ? { nome: attraction.nome, preco: attraction.preco } : { nome: '', preco: 0 };
    }

    // Método para exibir o diálogo de edição

  showDialog() {
        this.visible = true;
    }

    //PopUp de confirmação para deletar um item da aba roteiro
    deleteItem(event: Event, index: number) {
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
