import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private pedidoConnection!: signalR.HubConnection;

  // Canais de comunicação para os componentes
  public atualizarGraficos$ = new Subject<void>();
  public novaNotificacaoTexto$ = new Subject<string>();

  constructor() {
    this.iniciarConexaoPedidos();
  }

  private iniciarConexaoPedidos() {
    this.pedidoConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7223/hubs/pedidos', {
        accessTokenFactory: () => sessionStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.pedidoConnection.start().catch(err => console.error('Erro PedidoHub:', err));

    this.pedidoConnection.on('AtualizarGraficos', () => {
      this.atualizarGraficos$.next();
    });
  }
}