import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profileForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    sobrenome: new FormControl(''),
    email: new FormControl('', [
      Validators.email
    ]),
    phone: new FormControl('', [
      Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)
    ]),
    bio: new FormControl('')
  });

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
    this.profileForm.get('phone')?.setValue(formatted, { emitEvent: false });
  }

  constructor() { }

}
