export class Avaliacao {

  constructor(
    private id: number,
    private agendaId: number,
    private prontuarioId: number,
    private tipo: string,

    private queixa?: string,
    private historia?: string,
    private doencas?: string,
    private medicamentos?: string,
    private cirurgias?: string,

    private dor?: number,
    private inspecao?: string,
    private palpacao?: string,
    private adm?: string,
    private forca?: string,
    private testes?: string,

    private diagnostico?: string,
    private objetivos?: string,
    private plano?: string,
    private observacoes?: string
  ) { }

  getId() { return this.id; }
  getAgendaId() { return this.agendaId; }
  getProntuarioId() { return this.prontuarioId; }
  getTipo() { return this.tipo; }

  getQueixa() { return this.queixa; }
  getHistoria() { return this.historia; }
  getDoencas() { return this.doencas; }
  getMedicamentos() { return this.medicamentos; }
  getCirurgias() { return this.cirurgias; }

  getDor() { return this.dor; }
  getInspecao() { return this.inspecao; }
  getPalpacao() { return this.palpacao; }
  getAdm() { return this.adm; }
  getForca() { return this.forca; }
  getTestes() { return this.testes; }

  getDiagnostico() { return this.diagnostico; }
  getObjetivos() { return this.objetivos; }
  getPlano() { return this.plano; }
  getObservacoes() { return this.observacoes; }
}