import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signUpForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private service: AuthenticationService, private messageService: MessageService, private Router: Router) {
    this.signUpForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.passwordMatchValidator
    });
    // Custom validator to check that password and confirmPassword match
    this.signUpForm.get('confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(6),
      this.passwordMatchValidator.bind(this)
    ]);
    this.signUpForm.get('senha')?.setValidators([
      Validators.required,
      Validators.minLength(6)
    ]);
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('senha')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
  this.service.register(this.signUpForm.value).subscribe({
    next: (response) => {

          // Armazena o token do usuário no localStorage
          localStorage.setItem('token', (response?.token));
          // Armazena o ID do usuário no localStorage
          localStorage.setItem('userId', (response?.user.id));
          // Armazena o nome do usuário no localStorage
          localStorage.setItem('userName', (response?.user.nome));
          // Armazena a foto do usuário no localStorage
          localStorage.setItem('userPhoto', (response?.user.foto));

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuário criado com sucesso!'
      });
      this.Router.navigate(['/']).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      console.error('Error signing up:', error);

      const errorMsg = error.error?.error || 'Erro ao criar usuário.';
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMsg
      });
    }
  });
}


}
