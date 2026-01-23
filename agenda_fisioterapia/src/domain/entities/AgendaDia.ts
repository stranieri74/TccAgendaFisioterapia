export enum DiaSemana {
  SEGUNDA = "SEGUNDA",
  TERCA = "TERÇA",
  QUARTA = "QUARTA",
  QUINTA = "QUINTA",
  SEXTA = "SEXTA",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO"
}

export class AgendaDia {
  constructor(
    private id: number,
    private agendaId: number,
    private data: Date | null,
    private diaSemana: DiaSemana,
    private hora: string
  ) {
    this.id = id,
    this.agendaId = agendaId,
    this.data =data,
    this.diaSemana = diaSemana,
    this.hora = hora
  }

  getId() : number  {
    return this.id;
  }

  getAgendaId() : number  {
    return this.agendaId;
  }

  getData() {
    return this.data;
  }

  getDiaSemana() : DiaSemana {
    return this.diaSemana;
  }

  getHora(): string {
    return this.hora;
  }
}