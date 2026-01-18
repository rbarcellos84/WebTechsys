import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private hubConnection!: signalR.HubConnection;
  public pedidos = signal<any[]>([]);

  constructor() {
    this.carregarPedidosIniciais();

    setTimeout(() => {
      this.iniciarConexao();
    }, 1000);
  }

  setPedidos(novosPedidos: any[]) {
    this.pedidos.set(novosPedidos);
  }

  private carregarPedidosIniciais() {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}` };
    const url = 'https://localhost:7223/api/Pedidos/obter-todos';

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (dados) => this.pedidos.set(dados),
      error: (err) => {
        if (err.status === 401) console.error('Sessão expirada ou token inválido.');
      }
    });
  }

  private iniciarConexao() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7223/hubs/notificacoes', {
        accessTokenFactory: () => sessionStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.error('Erro ao conectar ao SignalR:', err));

    this.hubConnection.on('AtualizarStatusPedido', (pedidoAtualizado: any) => {
      this.pedidos.update(lista =>
        lista.map(p => p.id === pedidoAtualizado.id ? pedidoAtualizado : p)
      );
    });
  }

  atualizarStatus(numeroPedido: string, novoStatus: number) {
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = 'https://localhost:7223/api/Pedidos/atualizar-status';
    const body = {
      numeroPedido: numeroPedido,
      novoStatus: novoStatus
    };
    return this.http.put(url, body, { headers });
  }
}