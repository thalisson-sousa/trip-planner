import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleSigninComponent } from "../../components/google-signin/google-signin.component";
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [DividerModule, ButtonModule, InputTextModule, CommonModule, GoogleSigninButtonModule, GoogleSigninComponent]
})
export class SignInComponent {

  constructor(
  ) {}

}
