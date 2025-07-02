export type UserResponse = {
  user: {
    id: string;
    nome: string;
    email: string;
    foto: string;
  }
  token: string;
}
