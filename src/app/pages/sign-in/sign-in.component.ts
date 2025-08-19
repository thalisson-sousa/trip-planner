import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleSigninComponent } from "../../components/google-signin/google-signin.component";
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [DividerModule, ButtonModule, InputTextModule, CommonModule, GoogleSigninButtonModule, GoogleSigninComponent, ReactiveFormsModule, ToastModule],
})
export class SignInComponent {

  //criar um FormGroup para o formulário de login
  signInForm: FormGroup;

  //criar um método para o login
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.authService.login(this.signInForm.value).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso!' });

          // Armazena o token do usuário no localStorage
          localStorage.setItem('token', (response?.token));
          // Armazena o ID do usuário no localStorage
          localStorage.setItem('userId', (response?.user.id));
          // Armazena o nome do usuário no localStorage
          localStorage.setItem('userName', (response?.user.nome));
          // Armazena a foto do usuário no localStorage
          localStorage.setItem('userPhoto', (response?.user.foto));
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Usuário ou senha inválidos' });
          console.error('Erro ao fazer login:', error);
        }
      });
    } else {
      console.warn('Formulário inválido');
    }
  }
}
