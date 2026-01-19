import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_BASE = environment.apiURL;

  usuarioLogado = signal<string | null>(sessionStorage.getItem('user_email'));

  constructor() { }

  login(credenciais: any) {
    return this.http.post<any>(`${this.API_BASE}/api/Login/login`, credenciais);
  }

  recuperarSenha(email: string) {
    return this.http.post<any>(`${this.API_BASE}/Login/recuperar-senha`, { email });
  }

  logout() {
    sessionStorage.clear();
    this.usuarioLogado.set(null);
    this.router.navigate(['/login']);
  }

  getEmailUsuario(): string {
    const emailSimples = sessionStorage.getItem('user_email');
    if (emailSimples) return emailSimples;

    const dadosUsuario = sessionStorage.getItem('usuario_logado');
    if (dadosUsuario) {
      try {
        const objetoUsuario = JSON.parse(dadosUsuario);
        return objetoUsuario.email || '';
      } catch {
        return '';
      }
    }

    return '';
  }
}
