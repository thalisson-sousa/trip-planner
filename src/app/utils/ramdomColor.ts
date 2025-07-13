export function gerarCorAleatoria() {
  let cor = '';
  const letras = '0123456789abcdef';
  for (let i = 0; i < 6; i++) {
    cor += letras[Math.floor(Math.random() * 16)];
  }
  return cor;
}
