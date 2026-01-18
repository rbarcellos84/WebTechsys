import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  // Objeto seguindo o Schema do seu Swagger
  novoUsuario = {
    nome: '',
    email: '',
    senha: ''
  };

  async registrar() {
    try {
      const url = 'https://localhost:7223/api/Login/cadastrar';
      // Chamada para a sua API C# que retorna "Usuário cadastrado com sucesso"
      await firstValueFrom(this.http.post(url, this.novoUsuario));

      alert('Usuário cadastrado com sucesso!');
      this.router.navigate(['/login']);
    } catch (error) {
      alert('Erro ao cadastrar usuário. Verifique se o e-mail já existe.');
    }
  }
}