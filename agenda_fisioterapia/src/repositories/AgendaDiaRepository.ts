import { prisma } from '@/prisma/infra/database/prisma';
export class AgendaDiaRepository {

  create(data: any) {
    return prisma.agendaDia.create({ data });
  }

async findById(id: number) {
    return prisma.agendaDia.findUnique({
      where: { id },
      include: {
        agenda: true
      }
    });
  }

findConflict(
    profissionalId: number,
    data: Date,
    hora: string,
    ignoreId?: number
  ) {
    return prisma.agendaDia.findFirst({
      where: {
        id: ignoreId ? { not: ignoreId } : undefined,
        data,
        hora,
        agenda: {
          profissionalId
        },
        status: {
          not: "CANCELADO"
        }
      }
    });
  }

findByAgenda(agendaId: number) {
    return prisma.agendaDia.findMany({
      where: { agendaId }
    });
  }
  
  findWeekly(
    profissionalId: number,
    inicio: Date,
    fim: Date
  ) {
    return prisma.agendaDia.findMany({
      where: {
        data: { gte: inicio, lte: fim },
        agenda: { profissionalId }
      },
      include: {
        agenda: {
          include: {
            paciente: true
          }
        }
      },
      orderBy: [
        { data: "asc" },
        { hora: "asc" }
      ]
    });
  }

async update(id: number, data: any) {
    return prisma.agendaDia.update({
      where: { id },
      data
    });
  }

async updateStatus(id: number, status: string) {

  const existe = await prisma.agendaDia.findUnique({
    where: { id }
  });

  if (!existe) {
    throw new Error("Sessão não encontrada");
  }

  return prisma.agendaDia.update({
    where: { id },
    data: { status }
  });
}

  deleteByAgenda(agendaId: number) {
  return prisma.agendaDia.deleteMany({
    where: { agendaId }
  });
}
}