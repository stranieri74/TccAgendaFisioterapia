export enum TipoAtendimento {
  FISIOTERAPIA = "FISIOTERAPIA",
  AVALIACAO = "AVALIACAO",
  RETORNO = "RETORNO"
}

export class Agenda {
  constructor(
    public id: number | null,
    public pacienteId: number,
    public profissionalId: number,
    public usuarioId: number,
    public tipo: TipoAtendimento,
    public dataInicio: Date,
    public dataFim?: Date,
    public observacao?: string,
    public ativo: boolean = true
  ) {}

  getId(): number | null {
    return this.id;
  }

  getPacienteId(): number {
    return this.pacienteId;
  }

  getProfissionalId(): number {
    return this.profissionalId;
  }

  getUsuarioId(): number {
    return this.usuarioId;
  }

  getTipo(): TipoAtendimento {
    return this.tipo;
  }

  getDataInicio(): Date {
    return this.dataInicio;
  }

  getDataFim(): Date | undefined {
    return this.dataFim;
  }

  getObservacao(): string | undefined {
    return this.observacao;
  }

  getAtivo(): boolean {
    return this.ativo;
  }
}