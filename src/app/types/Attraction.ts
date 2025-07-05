import { User } from "./User";

export type Attraction = {
  id: number;
  nome?: string;
  descricao?: string;
  valor: number;
  pagadorId?: User;
  isAttraction: boolean;
};
