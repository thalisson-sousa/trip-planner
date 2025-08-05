export type Travel = {
  id: number;
  nome: string;
  destino: string;
  dataInicio: string; // formato ISO: "2025-07-14"
  dataFim: string;    // formato ISO: "2025-07-19"
  status: string;
  totalGastos: number;
  nomeCriador: string;
  imageUrl: string;
  participantes: Participante[];
  atividades: Atividade[];
  gastos: Gasto[];
  votacoes: Votacao[];
};

export type Participante = {
  id?: number;
  nome: string;
  email?: string;
};

export type Atividade = {
  id?: number;
  viagemId?: number;
  nome?: string;
  descricao?: string | null;
  valor?: number;
  dataHora?: string | null; // formato ISO ou null
  status?: string | null;
};

export type Gasto = {
  id: number;
  viagemId: number;
  nome: string;
  valor: number;
  nomePagador: string;
  participantes: Participante[];
};

export type Votacao = {
  id?: number;
  titulo?: string;
  opcoes?: string[];
  votos?: Voto[];
};

export type Voto = {
  id?: number;
  participanteId?: number;
  opcaoEscolhida?: string;
};
