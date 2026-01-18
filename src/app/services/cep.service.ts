import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CepService {
  private http = inject(HttpClient);

  async buscarEndereco(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    try {
      return await firstValueFrom(
        this.http.get<any>(`https://viacep.com.br/ws/${cleanCep}/json/`)
      );
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      return null;
    }
  }
}