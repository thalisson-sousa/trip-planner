import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignInComponent } from "./pages/sign-in/sign-in.component";
import { CommonModule } from '@angular/common';
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    SignInComponent,
    SignUpComponent,
    Toast,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trip-planner';

  isLoginPage: boolean = false;
  isSignUpPage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
      this.isSignUpPage = this.router.url === '/signup';
    });
  }
}
