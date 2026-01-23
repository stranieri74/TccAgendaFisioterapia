export enum TipoAtendimento {
  FISIOTERAPIA = "FISIOTERAPIA",
  AVALIACAO = "AVALIACAO"
}

export class Agenda {

    private id: number;
    private pacienteId: number;
    private profissionalId: number;
    private usuarioId: number;
    private tipoAtendimento: TipoAtendimento;

  constructor(
     id: number,
     pacienteId: number,
     profissionalId: number,
     usuarioId: number,
     tipoAtendimento: TipoAtendimento
  ) {
       this.id = id,
       this.pacienteId = pacienteId,
       this.profissionalId = profissionalId,
       this.usuarioId = usuarioId
       this.tipoAtendimento = tipoAtendimento

  }

  getId()  : number {
    return this.id;
  }

  getPacienteId() : number {
    return this.pacienteId;
  }

  getProfissionalId() : number {
    return this.profissionalId;
  }

  getUsuarioId() : number {
    return this.usuarioId;
  }

  getTipoAtendimento() : TipoAtendimento {
    return this.tipoAtendimento;
  }
}