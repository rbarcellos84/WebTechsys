import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private hubConnection!: signalR.HubConnection;
  
  public pedidos = signal<any[]>([]);

  private readonly API_BASE = environment.apiURL;

  constructor() {
    this.carregarPedidosIniciais();
    this.iniciarConexao();
  }

  public carregarPedidosIniciais() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}` };
    const url = `${this.API_BASE}/Pedidos/obter-todos`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (dados) => {
        this.pedidos.set(dados); 
        console.log('Dados de pedidos sincronizados com sucesso.');
      },
      error: (err) => console.error('Erro ao carregar pedidos da API:', err)
    });
  }

  private iniciarConexao() {
    const hubUrl = `${this.API_BASE.replace('/api', '')}/hubs/pedidos`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => sessionStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('Conectado ao SignalR: Pronto para receber atualizações.'))
      .catch(err => console.error('Erro ao conectar ao SignalR:', err));

    this.hubConnection.on('AtualizarGraficos', () => {
      console.warn('Mudança detectada no servidor! Recarregando dados para o gráfico...');
      this.carregarPedidosIniciais(); 
    });
  }

  atualizarStatus(numeroPedido: string, novoStatus: number) {
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = `${this.API_BASE}/Pedidos/atualizar-status`;
    const body = { numeroPedido, novoStatus };

    return this.http.put(url, body, { headers });
  }
}