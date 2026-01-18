import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { CadastroPedidoComponent } from './features/pedidos/cadastro-pedido/cadastro-pedido.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CadastroComponent } from './features/auth/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './features/auth/recuperar-senha/recuperar-senha.component';
import { AtualizarStatusComponent } from './features/operacao/atualizar-status/atualizar-status.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'novo-pedido', component: CadastroPedidoComponent },
  { path: 'atualizar-status', component: AtualizarStatusComponent },
  { path: '**', redirectTo: 'login' }
];