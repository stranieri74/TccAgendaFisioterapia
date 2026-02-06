import { Evolucao } from '@/domain/entities/Evolucao';
import { EvolucaoRepository } from '@/repositories/EvolucaoRepository';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { AgendaDiaRepository } from '@/repositories/AgendaDiaRepository';
import { AgendaRepository } from '@/repositories/AgendaRepository';

export class EvolucaoService {

  constructor(
    private evolucaoRepository: EvolucaoRepository,
    private prontuarioRepository: ProntuarioRepository,
    private agendaDiaRepository: AgendaDiaRepository,
    private agendaRepository: AgendaRepository
  ) { }

  async cadastrar(dados: {
    agendaDiaId: number;
    conduta?: string;
    exercicios?: string;
    recursos?: string;
    respostaPaciente?: string;
    observacoes?: string;
    alta: boolean
  }): Promise<Evolucao> {

    if (!dados.agendaDiaId) {
      throw new Error('AgendaDia é obrigatório');
    }

    // busca agendaDia
    const agendaDia = await this.agendaDiaRepository.findById(dados.agendaDiaId);
    if (!agendaDia) {
      throw new Error('Sessão não encontrada');
    }
    // prontuário ativo
    const prontuario = await this.prontuarioRepository
      .buscarAtivoPorPacienteEProfissional(
        agendaDia.agenda.pacienteId,
        agendaDia.agenda.profissionalId
      );

    if (!prontuario) {
      throw new Error('Prontuário não encontrado');
    }

    // cria evolução
    const evolucao = new Evolucao(
      0,
      prontuario.getId(),
      dados.agendaDiaId,
      new Date(),

      dados.conduta,
      dados.exercicios,
      dados.recursos,
      dados.respostaPaciente,
      dados.observacoes,
      dados.alta === true
    );

    const salva = await this.evolucaoRepository.salvar(evolucao);

    // atualiza status da sessão
    await this.agendaDiaRepository.AtualizaStatus(
      dados.agendaDiaId,
      'REALIZADO'
    );
    if (dados.alta === true) {
      if (!agendaDia.data) {
        throw new Error('Data da sessão não informada');
      }
      // marca data fim da agenda
      await this.agendaRepository.atualizarDataFim(
        agendaDia.agendaId,
        new Date()
      );

      // 2️⃣ cancela sessões futuras
      await this.agendaDiaRepository.cancelarSessoesFuturas(
        agendaDia.agendaId,
        agendaDia.data
      );
    }

    return salva;
  }

  listarTodas() {
    return this.evolucaoRepository.listarTodas();
  }

  listarEvolucaoId(evolucaoId: number) {
    return this.evolucaoRepository.findById(evolucaoId);
  }

  async listarFisioterapiaHojePorProfissional(
    profissionalId: number
  ) {

    if (!profissionalId || profissionalId <= 0) {
      throw new Error('Profissional inválido');
    }

    return this.agendaDiaRepository
      .listarFisioterapiaHojePorProfissional(profissionalId);
  }


  async atualizar(dados: {
    id: number;
    agendaDiaId: number;
    conduta: string;
    exercicios: string;
    recursos: string;
    respostaPaciente: string;
    data: Date;
    observacoes?: string;
    alta: boolean
  }) {

    if (!dados.id || dados.id <= 0) {
      throw new Error('ID da evolução é obrigatório');
    }

    const evolucaoExistente =
      await this.evolucaoRepository.findById(dados.id);

    if (!evolucaoExistente) {
      throw new Error('Evolução não encontrada');
    }

    // busca agendaDia
    const agendaDia = await this.agendaDiaRepository.findById(dados.agendaDiaId);

    if (!agendaDia) {
      throw new Error('Sessão não encontrada');
    }

    // prontuário ativo

    const prontuario =
      await this.prontuarioRepository.buscarAtivoPorPacienteEProfissional(
        agendaDia.agenda.pacienteId,
        agendaDia.agenda.profissionalId
      );

    if (!prontuario) {
      throw new Error('Prontuário não encontrado');
    }

    const evolucao = new Evolucao(
      dados.id,
      prontuario.getId(),
      dados.agendaDiaId,
      dados.data,
      dados.conduta,
      dados.exercicios,
      dados.recursos,
      dados.respostaPaciente,
      dados.observacoes,
      dados.alta === true
    );
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);


    if (dados.alta === true) {

      if (!agendaDia.data) {
        throw new Error('Data da sessão não informada');
      }

      // 1️⃣ marca data fim da agenda
      await this.agendaRepository.atualizarDataFim(
        agendaDia.agendaId,
        hoje
      );

      // 2️⃣ cancela sessões futuras
      await this.agendaDiaRepository.cancelarSessoesFuturas(
        agendaDia.agendaId,
        agendaDia.data
      );
    }
    else {
      if (!agendaDia.data) {
        throw new Error('Data da sessão não informada');
      }

      await this.agendaDiaRepository.reverterAltaIndevida(
        agendaDia.agendaId,
        agendaDia.data
      );
    }
    return this.evolucaoRepository.atualizar(evolucao);

  }

}
