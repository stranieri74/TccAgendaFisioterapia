import { Agenda, TipoAtendimento } from '@/domain/entities/Agenda';
import { AgendaRepository } from '@/repositories/AgendaRepository';
import { AgendaDiaRepository } from '@/repositories/AgendaDiaRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';

export class AgendaService {
  constructor(
    private repository: AgendaRepository,
    private agendaDiaRepository: AgendaDiaRepository,
    private pacienteRepository: PacienteRepository,
    private funcionarioRepository: FuncionarioRepository
  ) {}

  async cadastrar(dados: {
    pacienteId: number;
    profissionalId: number;
    usuarioId: number;
    tipo: TipoAtendimento;
    dias: {
      data?: Date;
      diaSemana?: string;
      hora: string;
    }[];
  }): Promise<Agenda> {

    if (!dados.tipo?.trim()) {
      throw new Error('Tipo da agenda é obrigatório');
    }

    if (!dados.dias || dados.dias.length === 0) {
      throw new Error('É necessário informar ao menos um dia/horário');
    }

    if (!dados.profissionalId || dados.profissionalId <= 0) {
      throw new Error('Profissional é obrigatório');
    }

    if (!dados.pacienteId || dados.pacienteId <= 0) {
      throw new Error('Paciente é obrigatório');
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
    const agenda = new Agenda(
      0,
      dados.pacienteId,
      dados.profissionalId,
      dados.usuarioId,
      dados.tipo
    );

    const agendaSalva = await this.repository.salvar(agenda);

    for (const d of dados.dias) {
      if (!d.hora?.trim()) {
        throw new Error('Hora é obrigatória');
      }

      await this.agendaDiaRepository.salvar(
        new (require('@/domain/entities/AgendaDia').AgendaDia)(
          null,
          agendaSalva.getId()!,
          d.data ?? null,
          d.diaSemana ?? null,
          d.hora
        )
      );
    }

    return agendaSalva;
  }

async listar(): Promise<Agenda[]> {
    return this.repository.listar();
  }

  async listarPorPaciente(pacienteId: number) {
    const paciente = await this.pacienteRepository.buscarPorId(pacienteId);
    if (!paciente) {
       throw new Error('Paciente não encontrado');
    }
    return this.repository.listarPorPaciente(pacienteId);
  }

  async listarPorProfissional(profissionalId: number) {
    const profissional = await this.funcionarioRepository.buscarPorId(profissionalId);
    if (!profissional) {
      throw new Error('Profissional não encontrado');
    }
    return this.repository.listarPorProfissional(profissionalId);
  }

  async buscarPorId(id: number) {
    const agenda = await this.repository.buscarPorId(id);
    if (!agenda) {
      throw new Error('Agenda não encontrada');
    }
    return agenda;
  }

  async deletar(id: number) {
    const agenda = await this.repository.buscarPorId(id);
    if (!agenda) {
      throw new Error('Agenda não encontrada');
    }

    await this.agendaDiaRepository.deletarPorAgenda(id);
    await this.repository.deletar(id);
  }

async atualizar(dados: {
  id: number;
  pacienteId: number;
  profissionalId: number;
  usuarioId: number;
  tipo: TipoAtendimento;
  dias: {
    data?: Date;
    diaSemana?: string;
    hora: string;
  }[];
}): Promise<Agenda> {

  if (!dados.id || dados.id <= 0) {
    throw new Error('ID da agenda é obrigatório');
  }

  const agendaExistente = await this.repository.buscarPorId(dados.id);
  if (!agendaExistente) {
    throw new Error('Agenda não encontrada');
  }

  if (!dados.dias || dados.dias.length === 0) {
    throw new Error('É necessário informar ao menos um dia/horário');
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

  const agenda = new Agenda(
    dados.id,
    dados.pacienteId,
    dados.profissionalId,
    dados.usuarioId,
    dados.tipo
  );

  const agendaAtualizada = await this.repository.atualizar(agenda);

  // apagar dias cadastrados
  await this.agendaDiaRepository.deletarPorAgenda(dados.id);

  // inserir os dias atualizados
  for (const d of dados.dias) {
    if (!d.hora?.trim()) {
      throw new Error('Hora é obrigatória');
    }

    await this.agendaDiaRepository.salvar(
      new (require('@/domain/entities/AgendaDia').AgendaDia)(
        null,
        dados.id,
        d.data ?? null,
        d.diaSemana ?? null,
        d.hora
      )
    );
  }

  return agendaAtualizada;
}

}