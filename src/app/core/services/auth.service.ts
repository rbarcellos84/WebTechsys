import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_BASE = 'https://localhost:7223/api';

  usuarioLogado = signal<string | null>(sessionStorage.getItem('user_email'));

  constructor() { }

  login(credenciais: any) {
    return this.http.post<any>(`${this.API_BASE}/Login/login`, credenciais);
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
