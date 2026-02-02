import { Avaliacao } from '@/domain/entities/Avaliacao';
import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';

import { AvaliacaoRepository } from '@/repositories/AvaliacaoRepository';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { AgendaRepository } from '@/repositories/AgendaRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { agoraBrasil } from '@/shared/utils/DataBrasil';

export class AvaliacaoService {

  constructor(
    private avaliacaoRepository: AvaliacaoRepository,
    private prontuarioRepository: ProntuarioRepository,
    private agendaRepository: AgendaRepository,
  ) {}

  async cadastrar(dados: {
  agendaId: number;
  tipo: TipoEvolucao;

  queixa?: string;
  historia?: string;
  doencas?: string;
  medicamentos?: string;
  cirurgias?: string;

  dor?: number;
  inspecao?: string;
  palpacao?: string;
  adm?: string;
  forca?: string;
  testes?: string;

  diagnostico?: string;
  objetivos?: string;
  plano?: string;
  observacoes?: string;
}): Promise<Avaliacao> {

  if (!dados.agendaId || dados.agendaId <= 0) {
    throw new Error('Agenda é obrigatória');
  }

  const agenda = await this.agendaRepository.findById(dados.agendaId);
  if (!agenda) throw new Error('Agenda não encontrada');

  // 🔎 verifica se já existe prontuário
  let prontuario =
    await this.prontuarioRepository.buscarAtivoPorPacienteEProfissional(
      agenda.pacienteId,
      agenda.profissionalId
    );

  // ✅ SE NÃO EXISTIR → CRIA AGORA
  if (!prontuario) {
    prontuario = await this.prontuarioRepository.salvar(
      new Prontuario(
        0,
        agenda.pacienteId,
        agenda.profissionalId,
        agenda.usuarioId,
        agoraBrasil(),
        'Avaliação inicial do paciente',
        dados.tipo
      )
    );
  }

  // ✅ agora o ID existe
  const avaliacao = new Avaliacao(
    0,
    agenda.id!,
    prontuario.getId(),
    dados.tipo,

    dados.queixa,
    dados.historia,
    dados.doencas,
    dados.medicamentos,
    dados.cirurgias,

    dados.dor,
    dados.inspecao,
    dados.palpacao,
    dados.adm,
    dados.forca,
    dados.testes,

    dados.diagnostico,
    dados.objetivos,
    dados.plano,
    dados.observacoes
  );

  const avaliacaoSalva = await this.avaliacaoRepository.salvar(avaliacao);

await this.agendaRepository.atualizarStatusDia(
    agenda.id,
    'REALIZADO'
  );

  await this.agendaRepository.atualizarDataFim(
    agenda.id,
    new Date()
  );  

   return avaliacaoSalva;
}

 async buscarPorAgendaId(agendaId: number): Promise<Avaliacao | null> {

  if (!agendaId || agendaId <= 0) {
    throw new Error('Agenda inválida');
  }

  return this.avaliacaoRepository.buscarPorAgendaId(agendaId);
} 

async atualizar(dados: any): Promise<Avaliacao> {

  if (!dados.id || dados.id <= 0) {
    throw new Error('ID da avaliação é obrigatório');
  }

  const existente = await this.avaliacaoRepository.buscarPorAgendaId(dados.agendaId);

  if (!existente) {
    throw new Error('Avaliação não encontrada');
  }

  const avaliacao = new Avaliacao(
    existente.getId(),
    existente.getAgendaId(),
    existente.getProntuarioId(),
    existente.getTipo(),

    dados.queixa,
    dados.historia,
    dados.doencas,
    dados.medicamentos,
    dados.cirurgias,

    dados.dor,
    dados.inspecao,
    dados.palpacao,
    dados.adm,
    dados.forca,
    dados.testes,

    dados.diagnostico,
    dados.objetivos,
    dados.plano,
    dados.observacoes
  );

  return this.avaliacaoRepository.atualizar(avaliacao);
}
}