import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-atualizar-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atualizar-status.component.html',
  styleUrls: ['./atualizar-status.component.css']
})
export class AtualizarStatusComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  pedidoForm!: FormGroup;
  statusAtual: number = 0;
  pedidoEncontrado: boolean = false;

  listaStatus = [
    { id: 1, nome: 'Ingressado' },
    { id: 2, nome: 'Processando' },
    { id: 3, nome: 'Enviado' },
    { id: 4, nome: 'Ausente' },
    { id: 5, nome: 'Entregue' },
    { id: 6, nome: 'Cancelado' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.pedidoForm = this.fb.group({
      numeroPedido: ['', Validators.required],
      novoStatus: [null, Validators.required],
      usuarioEmail: [{ value: '', disabled: true }],
      descricao: [{ value: '', disabled: true }],
      valorTotal: [{ value: '', disabled: true }],
      itensExibicao: [{ value: '', disabled: true }],
      enderecoEntrega: this.fb.group({
        cep: [{ value: '', disabled: true }],
        rua: [{ value: '', disabled: true }],
        numero: [{ value: '', disabled: true }],
        bairro: [{ value: '', disabled: true }],
        cidade: [{ value: '', disabled: true }],
        estado: [{ value: '', disabled: true }]
      })
    });
  }

  get isEstadoFinal(): boolean {
    return this.statusAtual === 5 || this.statusAtual === 6;
  }

  buscarPedido() {
    const num = this.pedidoForm.get('numeroPedido')?.value;
    if (!num) return;

    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`https://localhost:7223/api/Pedidos/obter-por-numero/${num}`, { headers }).subscribe({
      next: (pedido) => {
        this.statusAtual = pedido.status;
        this.pedidoEncontrado = true;

        if (pedido.usuarioId) {
          this.buscarEmailUsuario(pedido.usuarioId);
        }

        this.pedidoForm.patchValue({
          descricao: pedido.descricao,
          valorTotal: pedido.valorTotal,
          novoStatus: pedido.status,
          itensExibicao: pedido.itens ? pedido.itens.join(', ') : '',
          enderecoEntrega: {
            cep: pedido.enderecoEntrega?.cep,
            rua: pedido.enderecoEntrega?.rua,
            numero: pedido.enderecoEntrega?.numero,
            bairro: pedido.enderecoEntrega?.bairro,
            cidade: pedido.enderecoEntrega?.cidade,
            estado: pedido.enderecoEntrega?.estado
          }
        });
      },
      error: () => {
        alert('Pedido não encontrado.');
        this.limparTela();
      }
    });
  }

  private buscarEmailUsuario(userId: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`https://localhost:7223/api/Usuario/obter-email/${userId}`, { headers }).subscribe({
      next: (res) => this.pedidoForm.patchValue({ usuarioEmail: res.usuarioEmail }),
      error: () => { }
    });
  }

  confirmarCancelamento() {
    if (confirm('Deseja realmente cancelar este pedido? Esta ação não pode ser desfeita.')) {
      this.enviarAtualizacao(6);
    }
  }

  avancarEstado() {
    if (!this.isEstadoFinal) {
      this.enviarAtualizacao(this.statusAtual + 1);
    }
  }

  salvarStatusManual() {
    const statusSel = parseInt(this.pedidoForm.get('novoStatus')?.value);
    this.enviarAtualizacao(statusSel);
  }

  private enviarAtualizacao(status: number) {
    const num = this.pedidoForm.get('numeroPedido')?.value;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { numeroPedido: num.toString(), novoStatus: status };

    this.http.put('https://localhost:7223/api/Pedidos/atualizar-status', payload, { headers }).subscribe({
      next: () => {
        alert('Status atualizado!');
        this.buscarPedido();
      },
      error: () => {
        alert('Ocorreu um erro ao atualizar o status do pedido.');
      }
    });
  }

  limparTela() {
    this.pedidoForm.reset();
    this.statusAtual = 0;
    this.pedidoEncontrado = false;
  }
}