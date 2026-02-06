export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  PROFISSIONAL = 'PROFISSIONAL',
  RECEPCAO = 'RECEPCAO'
}

export class Usuario {
  private id: number;
  private login: string;
  private senhaHash: string;
  private perfil: PerfilUsuario;
  private ativo: boolean;
  private funcionarioId: number

  constructor(
    id: number,
    login: string,
    senhaHash: string,
    perfil: PerfilUsuario,
    ativo: boolean,
    funcionarioId: number
  ) {
    this.id = id;
    this.login = login;
    this.senhaHash = senhaHash;
    this.perfil = perfil;
    this.ativo = ativo;
    this.funcionarioId = funcionarioId
  }

  getId(): number {
    return this.id;
  }

  getLogin(): string {
    return this.login;
  }

  getSenhaHash(): string {
    return this.senhaHash;
  }

  getPerfil(): PerfilUsuario {
    return this.perfil;
  }

  isAtivo(): boolean {
    return this.ativo;
  }

  getFuncionarioId(): number {
    if (!this.funcionarioId) {
      throw new Error('Usuário precisa ter um funcionário associado');
    }
    return this.funcionarioId;
  }

  setSenhaHash(senhaHash: string): void {
    this.senhaHash = senhaHash;
  }

}