import { prisma } from '@/prisma/infra/database/prisma';

export class AgendaRepository {

  async create(agenda: {
    pacienteId: number;
    profissionalId: number;
    usuarioId: number;
    tipo: string;
    dataInicio: Date;
    dataFim?: Date | null;
    observacao?: string | null;
    ativo: boolean;
  }) {
    return prisma.agenda.create({
      data: {
        pacienteId: agenda.pacienteId,
        profissionalId: agenda.profissionalId,
        usuarioId: agenda.usuarioId,
        tipo: agenda.tipo,
        dataInicio: agenda.dataInicio,
        dataFim: agenda.dataFim,
        observacao: agenda.observacao,
        ativo: agenda.ativo ? 1 : 0
      }
    });
  }

  async findById(id: number) {
    return prisma.agenda.findUnique({
      where: { id },
      include: {
        paciente: true,
        funcionario: true,
        usuario: true,
        AgendaDia: true
      }
    });
  }

  async findByProfissional(profissionalId: number) {
    return prisma.agenda.findMany({
      where: { profissionalId }
    });
  }

  // =====================================
  // BUSCAR TODAS AS AGENDAS
  // =====================================
  async findAll() {
    return prisma.agenda.findMany({
      include: {
        paciente: true,
        funcionario: true,
        usuario: true,
        AgendaDia: true
      },
      orderBy: {
        id: "desc"
      }
    });
  }

  async update(data: any) {
  return prisma.agenda.update({
    where: { id: data.id },
    data: {
      pacienteId: data.pacienteId,
      profissionalId: data.profissionalId,
      tipo: data.tipo,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      observacao: data.observacao,
      ativo: data.ativo ? 1 : 0
    }
  });
}

async delete(id: number) {
  return prisma.agenda.delete({
    where: { id }
  });
}

}