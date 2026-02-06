export interface AvaliacaoView {
  id: number;
  data: Date;
  tipo: string;
  queixa?: string | null;
  historia?: string | null;
  doencas?: string | null;
  medicamentos?: string | null;
  cirurgias?: string | null;
  dor?: number | null;
  inspecao?: string | null;
  palpacao?: string | null;
  adm?: string | null;
  forca?: string | null;
  teste?: string | null;
  diagnostico?: string | null;
  objetivos?: string | null;
  plano?: string | null;
  observacao?: string | null;
}

export interface EvolucaoView {
  id: number;
  data: Date;
  conduta?: string | null;
  exercicios?: string | null;
  recursos?: string | null;
  respostaPaciente?: string | null;
  observacoes?: string | null;
  alta: boolean;
}

export interface ProntuarioView {
  prontuarioId: number;
  criadoEm?: Date | null;

  paciente: {
    id: number;
    nome: string;
    dataNascimento: Date;
  };

  profissional: {
    id: number;
    nome: string;
    crefito: string;
  };

  avaliacao: AvaliacaoView[];
  evolucoes: EvolucaoView[];
}