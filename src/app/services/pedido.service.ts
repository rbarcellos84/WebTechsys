import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private readonly API_BASE = environment.apiURL;
  criarPedido(pedido: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.API_BASE}/api/pedidos`, pedido));
  }
}


