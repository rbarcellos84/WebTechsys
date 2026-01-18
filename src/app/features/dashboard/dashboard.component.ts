import { Component, inject, computed, OnInit, OnDestroy, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { SignalrService } from '../../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private signalrService = inject(SignalrService);
  private subs = new Subscription();
  private eRef = inject(ElementRef);

  public pedidos = signal<any[]>([]);
  public loading: boolean = false;
  public pedidoSelecionado: any = null;
  public pedidoParaAlterar: any = null;
  public exibirModalStatus: boolean = false;
  public novoStatusSelecionado: number = 1;
  public mensagemToast: string | null = null;

  public paginaAtual = signal<number>(0);
  public itensPorPagina = 11;

  public statusMap: any = {
    1: { texto: 'Ingressado', classe: 'ingressado', cor: '#36A2EB' },
    2: { texto: 'Processando', classe: 'processando', cor: '#FFCE56' },
    3: { texto: 'Enviado', classe: 'enviado', cor: '#4BC0C0' },
    4: { texto: 'Ausente', classe: 'ausente', cor: '#FF9F40' },
    5: { texto: 'Entregue', classe: 'entregue', cor: '#4CAF50' },
    6: { texto: 'Cancelado', classe: 'cancelado', cor: '#ff2f5c' }
  };

  // Signal computado para a tabela paginada
  public pedidosPaginados = computed(() => {
    const inicio = this.paginaAtual() * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.pedidos().slice(inicio, fim);
  });

  public totalPaginas = computed(() => Math.ceil(this.pedidos().length / this.itensPorPagina));

  ngOnInit() {
    this.obterTodosOsDados();

    // SignalR: Atualização de lista/gráficos
    this.subs.add(
      this.signalrService.atualizarGraficos$.subscribe(() => {
        this.obterTodosOsDados();
      })
    );

    // SignalR: Recebimento de alertas de texto
    this.subs.add(
      this.signalrService.novaNotificacaoTexto$.subscribe((msg) => {
        this.mostrarNotificacao(msg);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  mostrarNotificacao(mensagem: string) {
    this.mensagemToast = mensagem;
    setTimeout(() => this.mensagemToast = null, 5000);
  }

  obterTodosOsDados() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.loading = true;

    this.http.get<any[]>('https://localhost:7223/api/Pedidos/obter-todos', { headers }).subscribe({
      next: (res) => {
        this.pedidos.set(res);

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirDetalhes(pedido: any, event: MouseEvent) {
    event.stopPropagation();
    this.pedidoSelecionado = pedido;

    if (!pedido.lida) {
      this.marcarComoLido(pedido.numeroPedido);
    }
  }

  fecharPainel() { this.pedidoSelecionado = null; }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.pedidoSelecionado) return;

    const target = event.target as HTMLElement;

    const clicouNoCard = target.closest('.card-tech');
    const clicouNoLinkPedido = target.closest('strong');

    if (!clicouNoCard && !clicouNoLinkPedido) {
      this.fecharPainel();
    }
  }

  private marcarComoLido(numeroPedido: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`https://localhost:7223/api/Pedidos/marcar-como-lido/${numeroPedido}`, {}, { headers })
      .subscribe({
        next: () => {
          const novaLista = this.pedidos().map(p =>
            p.numeroPedido === numeroPedido ? { ...p, lida: true } : p
          );
          this.pedidos.set(novaLista);
        }
      });
  }

  proximaPagina() {
    if (this.paginaAtual() < this.totalPaginas() - 1) {
      this.paginaAtual.update(p => p + 1);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual() > 0) {
      this.paginaAtual.update(p => p - 1);
    }
  }

  public estatisticas = computed(() => {
    const dados = this.pedidos();
    return [1, 2, 3, 4, 5, 6].map(id => ({
      ...this.statusMap[id],
      total: dados.filter(p => p.status === id).length
    }));
  });

  public pieChartData = computed(() => {
    const dados = this.pedidos();
    return {
      labels: Object.values(this.statusMap).map((s: any) => s.texto),
      datasets: [{
        data: [1, 2, 3, 4, 5, 6].map(s => dados.filter(p => p.status === s).length),
        backgroundColor: Object.values(this.statusMap).map((s: any) => s.cor)
      }]
    };
  });

  confirmarAvancoManual() {
    if (!this.pedidoParaAlterar) return;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put('https://localhost:7223/api/Pedidos/atualizar-status', {
      numeroPedido: this.pedidoParaAlterar.numeroPedido,
      novoStatus: Number(this.novoStatusSelecionado)
    }, { headers }).subscribe({
      next: () => {
        this.exibirModalStatus = false;
        this.obterTodosOsDados();
      }
    });
  }
}