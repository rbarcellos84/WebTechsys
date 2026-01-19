import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  // Note que aqui usamos environment.apiUrl (verifique se é apiURL ou apiUrl no seu environment)
  private readonly API_BASE = environment.apiURL;

  public atualizarGraficos$ = new Subject<void>();
  public novaNotificacaoTexto$ = new Subject<string>();

  constructor() {
    this.iniciarConexao();
  }

  private iniciarConexao() {
    // AJUSTE: Como sua API_BASE já não tem o "/api", 
    // concatenamos diretamente com o caminho do Hub definido no Program.cs do C#
    const hubUrl = `${this.API_BASE}/hubs/pedidos`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        // Importante: O token deve ser enviado para hubs protegidos
        accessTokenFactory: () => sessionStorage.getItem('token') || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR: Conectado em http://127.0.0.1:7223/hubs/pedidos'))
      .catch(err => console.error('SignalR: Erro ao conectar no Hub:', err));

    // ESCUTANDO EVENTOS
    this.hubConnection.on('AtualizarGraficos', () => {
      console.log('SignalR: Evento "AtualizarGraficos" recebido!');
      this.atualizarGraficos$.next();
    });

    this.hubConnection.on('ReceberNotificacao', (mensagem: string) => {
      this.novaNotificacaoTexto$.next(mensagem);
    });

    this.hubConnection.onclose((error) => {
      console.warn('SignalR: Conexão encerrada.', error);
    });
  }

  public enviarMensagem(metodo: string, dados: any) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke(metodo, dados);
    }
  }

  public enviarAtualizacao() {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('NotificarNovoPedido')
        .catch(err => console.error('Erro ao invocar NotificarNovoPedido:', err));
    } else {
      this.atualizarGraficos$.next();
    }
  }
}