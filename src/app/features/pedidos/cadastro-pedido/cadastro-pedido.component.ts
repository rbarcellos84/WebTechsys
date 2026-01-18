import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-pedido.component.html',
  styleUrls: ['./cadastro-pedido.component.css']
})
export class CadastroPedidoComponent implements OnInit {
  pedidoForm!: FormGroup;
  loadingCep = false;
  usuarioId: string = '';
  emailUsuarioLogado: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.carregarDadosUsuario();
  }

  initForm() {
    this.pedidoForm = this.fb.group({
      numeroPedido: ['', Validators.required],
      descricao: ['', Validators.required],
      valorTotal: [null, [Validators.required]],
      itens: this.fb.array([this.fb.control('', Validators.required)]),
      enderecoEntrega: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: [{ value: '', disabled: true }],
        numero: ['', Validators.required],
        bairro: [{ value: '', disabled: true }],
        cidade: [{ value: '', disabled: true }],
        estado: [{ value: '', disabled: true }]
      })
    });
  }

  carregarDadosUsuario() {
    const email = this.authService.getEmailUsuario();
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (email) {
      this.emailUsuarioLogado = email;
      this.http.get<any>(`https://localhost:7223/api/Usuario/obter-id/${email}`, { headers })
        .subscribe({
          next: (res) => {
            this.usuarioId = res.usuarioId;
          },
          error: (err) => {
            if (err.status === 401) {
              this.router.navigate(['/login']);
            }
          }
        });
    }
  }

  get itens() {
    return this.pedidoForm.get('itens') as FormArray;
  }

  adicionarItem() {
    if (this.itens.length < 15) {
      this.itens.push(this.fb.control('', Validators.required));
    }
  }

  removerItem(index: number) {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
    }
  }

  consultarCep() {
    const cep = this.pedidoForm.get('enderecoEntrega.cep')?.value;
    if (cep && cep.length === 8) {
      this.loadingCep = true;
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.pedidoForm.get('enderecoEntrega')?.patchValue({
              rua: dados.logradouro,
              bairro: dados.bairro,
              cidade: dados.localidade,
              estado: dados.uf
            });
          }
        },
        complete: () => this.loadingCep = false
      });
    }
  }

  salvarPedido() {
    const rawData = this.pedidoForm.getRawValue();
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let valorTratado = rawData.valorTotal;
    if (typeof valorTratado === 'string') {
      valorTratado = parseFloat(valorTratado.replace(',', '.'));
    }

    const pedidoParaEnviar = {
      usuarioId: this.usuarioId,
      numero: rawData.numeroPedido,
      numeroPedido: rawData.numeroPedido,
      descricao: rawData.descricao,
      itens: rawData.itens,
      valorTotal: valorTratado,
      enderecoEntrega: {
        cep: rawData.enderecoEntrega.cep,
        rua: rawData.enderecoEntrega.rua,
        numero: rawData.enderecoEntrega.numero,
        Numero: rawData.enderecoEntrega.numero,
        bairro: rawData.enderecoEntrega.bairro,
        cidade: rawData.enderecoEntrega.cidade,
        estado: rawData.enderecoEntrega.estado
      }
    };

    this.http.post('https://localhost:7223/api/Pedidos/registrar', pedidoParaEnviar, { headers }).subscribe({
      next: (res: any) => {
        alert(res.mensagem || 'Pedido registrado com sucesso!');
        this.limparTela();
      },
      error: (err) => {
        alert('Erro ao registrar o pedido. Verifique os dados e tente novamente.');
      }
    });
  }

  limparTela() {
    this.pedidoForm.reset();
    this.itens.clear();
    this.adicionarItem();
    this.carregarDadosUsuario();
  }
}