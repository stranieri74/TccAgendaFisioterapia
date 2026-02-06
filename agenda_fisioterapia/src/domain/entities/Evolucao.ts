export class Evolucao {

  constructor(
    private id: number,
    private prontuarioId: number,
    private agendaDiaId: number,
    private data: Date,

    private conduta?: string,
    private exercicios?: string,
    private recursos?: string,
    private respostaPaciente?: string,
    private observacoes?: string,
    private alta?: boolean
  ) { }

  getId() { return this.id; }
  getProntuarioId() { return this.prontuarioId; }
  getAgendaDiaId() { return this.agendaDiaId; }
  getData() { return this.data; }

  getConduta() { return this.conduta; }
  getExercicios() { return this.exercicios; }
  getRecursos() { return this.recursos; }
  getRespostaPaciente() { return this.respostaPaciente; }
  getObservacoes() { return this.observacoes; }
  getAlta() { return this.alta === true }
}