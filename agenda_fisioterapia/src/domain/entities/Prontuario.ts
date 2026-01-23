export enum TipoEvolucao {
  AVALIACAO ='AVALIACAO',
  REAVALIACAO ='REAVALIACAO',
  SESSAO = 'SESSAO',
  ALTA = 'ALTA'
}

export class Prontuario {
  constructor(
    private id: number,
    private pacienteId: number,
    private profissionalId: number,
    private usuarioId: number,
    private data: Date,
    private evolucao: string,
    private tipo: TipoEvolucao,
  ) {this.id = id,
    this.data = data,
    this.evolucao = evolucao,
    this.tipo = tipo,
    this.pacienteId = pacienteId,
    this.profissionalId = profissionalId,
    this.usuarioId = usuarioId
  }

  getId() : number {
    return this.id;
  }

  getPacienteId() : number {
    return this.pacienteId;
  }

  getProfissionalId(): number {
    return this.profissionalId;
  }

  getUsuarioId() : number{
    return this.usuarioId;
  }

  getData() :Date{
    return this.data;
  }

  getEvolucao(): string {
    return this.evolucao;
  }

   getTipoEvolucao(): TipoEvolucao {
      return this.tipo;
    }
}