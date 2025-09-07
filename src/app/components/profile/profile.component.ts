import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Profile = {
  nome: string;
  email: string;
  telefone: string;
  bio: string;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    nome: new FormControl(''),
    email: new FormControl('', [
      Validators.email
    ]),
    telefone: new FormControl('', [
      Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)
    ]),
    bio: new FormControl('')
  });

  constructor() { }

  onPhoneInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 11) {
      input = input.substring(0, 11);
    }
    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7, 11)}`;
    } else if (input.length > 2) {
      formatted = `(${input.substring(0, 2)}) ${input.substring(2, 7)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    this.profileForm.get('telefone')?.setValue(formatted, { emitEvent: false });
  }

  submit() {
    if (this.profileForm.valid) {
      this.profileForm.get('nome')?.setValue(`${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`);

      const profile: Profile = {
        nome: this.profileForm.value.nome,
        email: this.profileForm.value.email,
        telefone: this.profileForm.value.telefone,
        bio: this.profileForm.value.bio
      }

      console.log(profile);
    } else {
      console.log('Formulário inválido');
    }
  }
}
