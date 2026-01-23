import { prisma } from '@/prisma/infra/database/prisma';
import { AgendaDia, DiaSemana } from '@/domain/entities/AgendaDia';

export class AgendaDiaRepository {

  async salvar(dia: AgendaDia): Promise<AgendaDia> {
    const result = await prisma.agendaDia.create({
      data: {
        agendaId: dia.getAgendaId(),
        data: new Date(new Date(dia.getData()!)),
        diaSemana: dia.getDiaSemana(),
        hora: dia.getHora()
      }
    });

    return new AgendaDia(
      result.id,
      result.agendaId,
      result.data,
      result.diaSemana as DiaSemana,
      result.hora
    );
  }

  async listarPorAgenda(agendaId: number): Promise<AgendaDia[]> {
    const dias = await prisma.agendaDia.findMany({
      where: { agendaId },
      orderBy: { hora: 'asc' }
    });

    return dias.map(d =>
      new AgendaDia(
        d.id,
        d.agendaId,
        d.data,
        d.diaSemana as DiaSemana,
        d.hora
      )
    );
  }

  async deletarPorAgenda(agendaId: number): Promise<void> {
    await prisma.agendaDia.deleteMany({
      where: { agendaId }
    });
  }
}