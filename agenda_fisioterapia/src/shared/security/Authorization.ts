import { PerfilUsuario } from '@/domain/entities/Usuario';

export function autorizar(
  perfilAtual: string,
  perfisPermitidos: PerfilUsuario[]
) {
  if (!perfisPermitidos.includes(perfilAtual as PerfilUsuario)) {
    throw new Error('Acesso negado');
  }
}