export enum Status {
  Ingressado = 1,
  Processando = 2,
  Enviado = 3,
  DestinatarioAusente = 4,
  Entregue = 5,
  Cancelado = 6
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Pedido {
  id?: string;
  cliente: string;
  endereco: string;
  status: 'Ingressado' | 'Processando' | 'Enviado' | 'Destinatário Ausente' | 'Entregue' | 'Cancelado';
  dataCriacao: Date;
}