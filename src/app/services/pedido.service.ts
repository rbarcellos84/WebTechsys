import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:5000/api/pedidos';

  criarPedido(pedido: any): Promise<any> {
    return firstValueFrom(this.http.post(this.API, pedido));
  }
}