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
}