export type Atividade = {
  id: number;
  viagemId: number;
  viagem : viagem;
  nome: string;
  descricao: string | null;
  valor: number;
  dataHora: string | null;
  status: string | null;
}

export type Gasto = {
    id: number;
    viagemId: number;
    nome: string;
    valor: number;
    nomePagador: string;
    participantes: any[];
}

export type criador = {
    id: number;
    nomeCriador: string;
}

export type viagem = {
    id: number;
}

export type TripData = {
    id: number;
    nome: string;
    destino: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    criador: criador;
    criadorId: number
    nomeCriador: string;
    participantes: { nome: string }[];
    atividades: Atividade[];
    gastos: Gasto[];
}
