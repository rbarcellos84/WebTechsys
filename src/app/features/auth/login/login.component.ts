import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  dados = {
    email: '',
    senha: ''
  };

  efetuarLogin() {
    this.authService.login(this.dados).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('user_email', this.dados.email);

        this.authService.usuarioLogado.set(this.dados.email);

        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        alert('E-mail ou senha incorretos.');
        console.error(err);
      }
    });
  }
}