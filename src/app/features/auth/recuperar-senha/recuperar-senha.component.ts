import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  emailInput: string = '';
  exibirMensagem: boolean = false;
  novaSenhaGerada: string = '';

  solicitarSenha() {
    if (this.emailInput.includes('@')) {
      this.novaSenhaGerada = 'NEW-' + Math.floor(1000 + Math.random() * 9000);
      this.exibirMensagem = true;
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  }
}