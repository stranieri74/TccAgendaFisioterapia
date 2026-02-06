import { prisma } from '@/prisma/infra/database/prisma';
import { Evolucao } from '@/domain/entities/Evolucao';

export class EvolucaoRepository {

  async salvar(evolucao: Evolucao): Promise<Evolucao> {

    const registro = await prisma.evolucoes.create({
      data: {
        prontuarioId: evolucao.getProntuarioId(),
        agendaDiaId: evolucao.getAgendaDiaId(),
        data: evolucao.getData(),

        conduta: evolucao.getConduta(),
        exercicios: evolucao.getExercicios(),
        recursos: evolucao.getRecursos(),
        respostaPaciente: evolucao.getRespostaPaciente(),
        observacoes: evolucao.getObservacoes()
      }
    });

    return new Evolucao(
      registro.id,
      registro.prontuarioId,
      registro.agendaDiaId,
      registro.data,
      registro.conduta,
      registro.exercicios,
      registro.recursos,
      registro.respostaPaciente,
      registro.observacoes,
      registro.alta
    );
  }
  async findById(id: number): Promise<Evolucao | null> {

    const registro = await prisma.evolucoes.findUnique({
      where: { id },
      include: {
        prontuario: true,
        AgendaDia: {
          include: {
            agenda: {
              include: {
                paciente: true,
                funcionario: true
              }
            }
          }
        }
      }
    });

    if (!registro) return null;

    return new Evolucao(
      registro.id,
      registro.prontuarioId,
      registro.agendaDiaId,
      registro.data,
      registro.conduta,
      registro.exercicios,
      registro.recursos,
      registro.respostaPaciente,
      registro.observacoes,
      registro.alta
    );
  }

  listarTodas() {
    return prisma.evolucoes.findMany({
      orderBy: { data: 'asc' },
      include: {
        AgendaDia: {
          include: {
            agenda: {
              include: {
                paciente: true,
                funcionario: true
              }
            }
          }
        }
      }
    });
  }

  listarPorAgendaDia(agendaDiaId: number) {
    return prisma.evolucoes.findMany({
      where: { agendaDiaId },
      orderBy: { data: 'asc' },
      include: {
        AgendaDia: {
          include: {
            agenda: {
              include: {
                paciente: true,
                funcionario: true
              }
            }
          }
        }
      }
    });
  }

  listarPorProntuario(prontuarioId: number) {
    return prisma.evolucoes.findMany({
      where: { prontuarioId },
      orderBy: { data: 'asc' },
      include: {
        AgendaDia: {
          include: {
            agenda: {
              include: {
                paciente: true,
                funcionario: true
              }
            }
          }
        }
      }
    });
  }

  async atualizar(evolucao: Evolucao): Promise<Evolucao> {

    const registro = await prisma.evolucoes.update({
      where: { id: evolucao.getId() },
      data: {
        prontuarioId: evolucao.getProntuarioId(),
        agendaDiaId: evolucao.getAgendaDiaId(),
        data: evolucao.getData(),

        conduta: evolucao.getConduta(),
        exercicios: evolucao.getExercicios(),
        recursos: evolucao.getRecursos(),
        respostaPaciente: evolucao.getRespostaPaciente(),
        observacoes: evolucao.getObservacoes(),
        alta: evolucao.getAlta() ? 1 : 0
      }
    });

    return new Evolucao(
      registro.id,
      registro.prontuarioId,
      registro.agendaDiaId,
      registro.data,
      registro.conduta,
      registro.exercicios,
      registro.recursos,
      registro.respostaPaciente,
      registro.observacoes,
      registro.alta
    );
  }
}