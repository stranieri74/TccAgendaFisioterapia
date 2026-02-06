import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { agoraBrasil } from '@/shared/utils/DataBrasil';
import { ProntuarioView, AvaliacaoView, EvolucaoView } from '@/domain/views/ProntuarioView';

export class ProntuarioService {
  constructor(
    private prontuariorepository: ProntuarioRepository,
    private pacienteRepository: PacienteRepository,
    private funcionarioRepository: FuncionarioRepository) { }

  async cadastrar(dados: {
    pacienteId: number;
    profissionalId: number;
    usuarioId: number;
    data: Date;
    tipo: TipoEvolucao;
    evolucao?: string
  }): Promise<Prontuario> {
    if (!dados.pacienteId || dados.pacienteId <= 0) {
      throw new Error('Paciente é obrigatório');
    }

    if (!dados.profissionalId || dados.profissionalId <= 0) {
      throw new Error('Profissional é obrigatório');
    }

    if (!dados.data) {
      throw new Error('Data é obrigatória');
    }

    if (!dados.evolucao) {
      throw new Error('Evolução é obrigatória');
    }

    // valida paciente
    const pacienteExiste = await this.pacienteRepository.buscarPorId(dados.pacienteId);
    if (!pacienteExiste) {
      throw new Error('Paciente não encontrado');
    }

    // valida profissional
    const profissionalExiste = await this.funcionarioRepository.buscarPorId(dados.profissionalId);
    if (!profissionalExiste) {
      throw new Error('Profissional não encontrado');
    }

    const prontuario = new Prontuario(
      0,
      dados.pacienteId,
      dados.profissionalId,
      dados.usuarioId,
      agoraBrasil(),
      dados.evolucao,
      dados.tipo
    );

    return await this.prontuariorepository.salvar(prontuario);
  }

  async listar(): Promise<Prontuario[]> {
    return this.prontuariorepository.listar();
  }

  async listarPorProfissional(profissionalId: number): Promise<Prontuario[]> {

    const profissional = await this.funcionarioRepository.buscarPorId(profissionalId);
    if (!profissional) {
      throw new Error('Profissional não encontrado');
    }
    return this.prontuariorepository.listarPorProfissional(profissionalId);
  }

  async listarPorPaciente(pacienteId: number): Promise<Prontuario[]> {
    // verifica se o paciente existe
    const paciente = await this.pacienteRepository.buscarPorId(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    // busca os prontuários
    return this.prontuariorepository.listarPorPaciente(pacienteId);
  }

  async buscarPorId(id: number): Promise<Prontuario> {
    if (!id || id <= 0) {
      throw new Error('ID é obrigatório para a busca');
    }

    const prontuario = await this.prontuariorepository.buscarPorId(id);
    if (!prontuario) {
      throw new Error('Prontuário não encontrado');
    }

    return prontuario;
  }

  async deletar(id: number): Promise<void> {
    const prontuarioExistente = await this.prontuariorepository.buscarPorId(id);
    if (!prontuarioExistente) {
      throw new Error('Prontuário não encontrado');
    }
    await this.prontuariorepository.deletarPorId(id);
  }

  async atualizar(dados: Prontuario): Promise<Prontuario> {
    const prontuarioExistente = await this.prontuariorepository.buscarPorId(dados.getId());
    if (!prontuarioExistente) {
      throw new Error('Prontuário não encontrado');
    }

    // valida paciente e profissional
    const pacienteExiste = await this.pacienteRepository.buscarPorId(dados.getPacienteId());
    if (!pacienteExiste) {
      throw new Error('Paciente não encontrado');
    }

    const profissionalExiste = await this.funcionarioRepository.buscarPorId(dados.getProfissionalId());
    if (!profissionalExiste) {
      throw new Error('Profissional não encontrado');
    }

    return await this.prontuariorepository.atualizar(dados);
  }

  async listarPorTipo(tipo: TipoEvolucao): Promise<Prontuario[]> {
    if (!tipo) {
      throw new Error('Tipo de evolução é obrigatório');
    }

    const prontuarios = await this.prontuariorepository.buscarPorTipo(tipo);

    if (!prontuarios || prontuarios.length === 0) {
      throw new Error(`Nenhum prontuário encontrado para o tipo ${tipo}`);
    }

    return prontuarios;
  }

  private mapearParaView(prontuario: any): ProntuarioView {
    return {
      prontuarioId: prontuario.id,
      criadoEm: prontuario.data,

      paciente: {
        id: prontuario.paciente.id,
        nome: prontuario.paciente.nome!,
        dataNascimento: prontuario.paciente.dataNascimento!
      },

      profissional: {
        id: prontuario.funcionario.id,
        nome: prontuario.funcionario.nome,
        crefito: prontuario.funcionario.crefito
      },

      avaliacao: prontuario.avaliacao
        ? prontuario.avaliacao.map((a: any): AvaliacaoView => ({
          id: a.id,
          data: a.data,
          tipo: a.tipo,
          queixa: a.queixa,
          historia: a.historia,
          doencas: a.doencas,
          medicamentos: a.medicamentos,
          cirurgias: a.cirurgias,
          dor: a.dor,
          inspecao: a.inspecao,
          palpacao: a.palpacao,
          adm: a.adm,
          forca: a.forca,
          teste: a.testes,
          diagnostico: a.diagnostico,
          objetivos: a.objetivos,
          plano: a.plano,
          observacao: a.observacoes
        }))
        : [],

      evolucoes: prontuario.evolucoes
        ? prontuario.evolucoes.map((e: any): EvolucaoView => ({
          id: e.id,
          data: e.data,
          conduta: e.conduta,
          exercicios: e.exercicios,
          recursos: e.recursos,
          respostaPaciente: e.respostaPaciente,
          observacoes: e.observacoes,
          alta: Number(e.alta) === 1
        }))
        : []
    };
  }

  async obterProntuarioPorCpf(cpf: string): Promise<ProntuarioView> {

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      throw new Error('CPF inválido');
    }

    // 1️⃣ buscar paciente
    const paciente =
      await this.pacienteRepository.buscarPorCpf(cpfLimpo);

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    // 2️⃣ buscar prontuário pelo pacienteId
    const prontuario =
      await this.prontuariorepository
        .buscarCompletoPorPacienteId(paciente.getId());

    if (!prontuario) {
      throw new Error('Prontuário não encontrado');
    }

    // 3️⃣ reaproveitar o mesmo mapeamento
    return this.mapearParaView(prontuario);
  }

  async obterProntuario(prontuarioId: number): Promise<ProntuarioView> {
    const prontuario =
      await this.prontuariorepository.buscarCompleto(prontuarioId);

    if (!prontuario) {
      throw new Error('Prontuário não encontrado');
    }

    return this.mapearParaView(prontuario);
  }
}

