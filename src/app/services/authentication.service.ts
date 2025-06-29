import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserResponse } from '../types/userResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly apiUrl = `${environment.API}/api/auth`;

  constructor(public auth: AngularFireAuth, private http: HttpClient) { }

  async loginWithGoogle() {
    try {

      const provider = new GoogleAuthProvider();
      const credentials = await this.auth.signInWithPopup(provider);
      return credentials.user;

    } catch (error) {
      console.error('Erro ao fazer login com o Google:', error);
      throw error;
    }
  }

  async signOrSignUp() {
    try {
      // Obtém o usuário autenticado
      const googleUser = await this.auth.currentUser;

      if (googleUser) {
        // Cria um objeto de usuário com os dados necessários
        const user = {
          nome: googleUser.displayName || 'Usuário sem nome',
          email: googleUser.email,
          senha: googleUser.uid, // Usando o UID do Firebase como senha (não recomendado para produção)
          foto: googleUser.photoURL // Adiciona a foto do usuário
        };

        // Verifica se o usuário já existe no backend
        const response = await this.http.post<UserResponse>(`${this.apiUrl}/social-login`, user).toPromise();
        if (!response) {
          throw new Error('Resposta do backend indefinida');
        }

        return response;
      } else {
        throw new Error('Usuário não autenticado');
      }

    } catch (error) {
      console.error('Erro ao verificar ou criar usuário:', error);
      throw error;
    }
  }

}
