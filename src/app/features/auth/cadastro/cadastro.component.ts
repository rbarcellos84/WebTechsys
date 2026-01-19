import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_BASE = environment.apiURL;

  novoUsuario = {
    nome: '',
    email: '',
    senha: ''
  };

  async registrar() {
    try {
      const url = `${this.API_BASE}/api/Login/cadastrar`;
      await firstValueFrom(this.http.post(url, this.novoUsuario));

      alert('Usuário cadastrado com sucesso!');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro no cadastro de usuário:', error);
      alert('Erro ao cadastrar usuário. Verifique se o servidor na porta 7223 está ativo.');
    }
  }
}