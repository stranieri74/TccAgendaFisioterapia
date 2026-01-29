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
      where: { profissionalId }, 
      include: {
        paciente: true,
        funcionario: true,
        AgendaDia: true
      },
    });
  }

async findAvaliacoesPendentesHoje(profissionalId: number) {

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  return prisma.agenda.findMany({
    where: {
      profissionalId,
      tipo: 'AVALIACAO',
      AgendaDia: {
        some: {
          status: {
            in: ['AGENDADO', 'REALIZOU']
          },
          data: {
            gte: hoje,
            lt: amanha
          }
        }
      }
    },

    include: {

      paciente: true,
      funcionario: true,

      // ✅ agenda do dia
      AgendaDia: {
        where: {
          status: {
            in: ['AGENDADO', 'REALIZOU']
          }
        },
        orderBy: {
          hora: 'asc'
        }
      },

      // ✅ AQUI ESTÁ A CHAVE
      avaliacao: {
        select: {
          id: true,
          data: true
        }
      }

    }
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

async atualizarStatusDia(
  agendaId: number,
  status: string
): Promise<void> {

  await prisma.agendaDia.updateMany({
    where: {
      agendaId,
      status: 'AGENDADO'
    },
    data: {
      status
    }
  });
}

async atualizarDataFim(
  agendaId: number,
  dataFim: Date
): Promise<void> {

  await prisma.agenda.update({
    where: { id: agendaId },
    data: {
      dataFim
    }
  });
}

}