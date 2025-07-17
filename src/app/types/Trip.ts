export type Trip = {
  id: string;
  nome: string;
  destino: string;
  dataInicio: string | Date;
  dataFim: string | Date;
  status: string;
  totalGastos: string;
  imageUrl: string;
}
