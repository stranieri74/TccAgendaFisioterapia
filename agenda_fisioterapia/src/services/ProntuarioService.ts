import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { agoraBrasil } from '@/shared/utils/DataBrasil';

export class ProntuarioService {
  constructor(
    private prontuariorepository: ProntuarioRepository,
    private pacienteRepository: PacienteRepository,
    private funcionarioRepository: FuncionarioRepository) {}

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
}