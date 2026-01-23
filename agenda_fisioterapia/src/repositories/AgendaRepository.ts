import { prisma } from '@/prisma/infra/database/prisma';
import { Agenda, TipoAtendimento } from '@/domain/entities/Agenda';

export class AgendaRepository {

  async salvar(agenda: Agenda): Promise<Agenda> {
    const result = await prisma.agenda.create({
      data: {
        paciente : {
          connect: {id: agenda.getPacienteId()}
        },
        funcionario : {
          connect: { id: agenda.getProfissionalId() }
        },
        usuario : {
          connect: { id: agenda.getUsuarioId() }
        },
        tipo: agenda.getTipoAtendimento()
      }
    });

    return new Agenda(
      result.id,
      result.pacienteId,
      result.profissionalId,
      result.usuarioId,
      result.tipo as TipoAtendimento
    );
  }

  async listar(): Promise<Agenda[]> {
    const agendas = await prisma.agenda.findMany();

    return agendas.map(a =>
      new Agenda(
        a.id,
        a.pacienteId,
        a.profissionalId,
        a.usuarioId,
        a.tipo as TipoAtendimento
      )
    );
  }

  async buscarPorId(id: number): Promise<Agenda | null> {
    const result = await prisma.agenda.findUnique({
      where: { id }
    });

    if (!result) return null;

    return new Agenda(
      result.id,
      result.pacienteId,
      result.profissionalId,
      result.usuarioId,
      result.tipo as TipoAtendimento
    );
  }

  async listarPorPaciente(pacienteId: number): Promise<Agenda[]> {
    const agendas = await prisma.agenda.findMany({
      where: { pacienteId }
    });

    return agendas.map(a =>
      new Agenda(
        a.id,
        a.pacienteId,
        a.profissionalId,
        a.usuarioId,
        a.tipo as TipoAtendimento
      )
    );
  }

  async listarPorProfissional(profissionalId: number): Promise<Agenda[]> {
    const agendas = await prisma.agenda.findMany({
      where: { profissionalId }
    });

    return agendas.map(a =>
      new Agenda(
        a.id,
        a.pacienteId,
        a.profissionalId,
        a.usuarioId,
        a.tipo as TipoAtendimento
      )
    );
  }

  async deletar(id: number): Promise<void> {
    await prisma.agenda.delete({
      where: { id }
    });
  }

  async atualizar(agenda: Agenda): Promise<Agenda> {
  const result = await prisma.agenda.update({
    where: { id: agenda.getId()! },
    data: {
      pacienteId: agenda.getPacienteId(),
      profissionalId: agenda.getProfissionalId(),
      usuarioId: agenda.getUsuarioId(),
      tipo: agenda.getTipoAtendimento()
    }
  });

  return new Agenda(
    result.id,
    result.pacienteId,
    result.profissionalId,
    result.usuarioId,
    result.tipo as TipoAtendimento
  );
}
}