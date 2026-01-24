export enum StatusAgendaDia {
  AGENDADO = "AGENDADO",
  REALIZADO = "REALIZADO",
  FALTOU = "FALTOU",
  CANCELADO = "CANCELADO"
}

export class AgendaDia {
  constructor(
    public id: number | null,
    public agendaId: number,
    public data: Date,
    public hora: string,
    public status: StatusAgendaDia = StatusAgendaDia.AGENDADO
  ) {}
}