import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-google-signin',
  imports: [],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.scss'
})
export class GoogleSigninComponent {

  constructor(private service: AuthenticationService, private Router: Router) { }

  signInWithGoogle() {
    this.service.loginWithGoogle().then(() => {

      this.service.signOrSignUp().then(res => {

         // Armazena o token do usuário no localStorage
        localStorage.setItem('token', (res?.token));
        // Armazena o ID do usuário no localStorage
        localStorage.setItem('userId', (res?.user.id));
        // Armazena o nome do usuário no localStorage
        localStorage.setItem('userName', (res?.user.nome));
        // Armazena a foto do usuário no localStorage
        localStorage.setItem('userPhoto', (res?.user.foto));

        // Redireciona para a página inicial após o login
         this.Router.navigate(['/']);
      }).catch(error => {
        console.error('Erro ao verificar ou criar usuário:', error);
      });
    }).catch(error => {
      console.error('Erro ao fazer login com o Google:', error);
    });
}

}
