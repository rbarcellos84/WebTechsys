export interface ItemPedido {
  nome: string;
}

export interface CadastroPedido {
  usuarioId: string;
  numeroPedido: string;
  descricao: string;
  itens: string[];
  valorTotal: number;
  enderecoEntrega: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: number;
}