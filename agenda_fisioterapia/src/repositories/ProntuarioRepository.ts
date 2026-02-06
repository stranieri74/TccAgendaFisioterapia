import { prisma } from '@/prisma/infra/database/prisma';
import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';
import { agoraBrasil } from '@/shared/utils/DataBrasil';

export class ProntuarioRepository {

  async salvar(prontuario: Prontuario): Promise<Prontuario> {
    const result = await prisma.prontuario.create({
      data: {
        tipo: prontuario.getTipoEvolucao(),
        evolucao: prontuario.getEvolucao(),

        paciente: {
          connect: { id: prontuario.getPacienteId() }
        },
        funcionario: {
          connect: { id: prontuario.getProfissionalId() }
        },
        usuario: {
          connect: { id: prontuario.getUsuarioId() }
        }
      }
    });

    return new Prontuario(
      result.id,
      result.pacienteId!,
      result.profissionalId!,
      result.usuarioId!,
      result.data!,
      result.evolucao!,
      result.tipo as TipoEvolucao
    );
  }


  async listar(): Promise<Prontuario[]> {
    const prontuarios = await prisma.prontuario.findMany();

    return prontuarios.map(p =>
      new Prontuario(
        p.id,
        p.pacienteId!,
        p.profissionalId!,
        p.usuarioId!,
        p.data!,
        p.evolucao!,
        p.tipo as TipoEvolucao
      )
    );
  }


  async buscarPorId(id: number): Promise<Prontuario | null> {
    const result = await prisma.prontuario.findUnique({
      where: { id }
    });

    if (!result) return null;

    return new Prontuario(
      result.id,
      result.pacienteId!,
      result.profissionalId!,
      result.usuarioId!,
      result.data!,
      result.evolucao!,
      result.tipo as TipoEvolucao
    );
  }

  async listarPorPaciente(pacienteId: number): Promise<Prontuario[]> {
    const prontuarios = await prisma.prontuario.findMany({
      where: { pacienteId }
    });

    return prontuarios.map(p =>
      new Prontuario(
        p.id,
        p.pacienteId!,
        p.profissionalId!,
        p.usuarioId!,
        p.data!,
        p.evolucao!,
        p.tipo as TipoEvolucao
      )
    );
  }

  async listarPorProfissional(profissionalId: number): Promise<Prontuario[]> {
    const prontuarios = await prisma.prontuario.findMany({
      where: { profissionalId }
    });

    return prontuarios.map(p =>
      new Prontuario(
        p.id,
        p.pacienteId!,
        p.profissionalId!,
        p.usuarioId!,
        p.data!,
        p.evolucao!,
        p.tipo as TipoEvolucao
      )
    );
  }

  async buscarPorTipo(tipo: TipoEvolucao): Promise<Prontuario[]> {
    const resultados = await prisma.prontuario.findMany({
      where: { tipo } // filtro direto pelo enum
    });

    return resultados.map(p =>
      new Prontuario(
        p.id,
        p.pacienteId!,
        p.profissionalId!,
        p.usuarioId!,
        p.data!,
        p.evolucao!,
        p.tipo as TipoEvolucao
      )
    );
  }

  async atualizar(prontuario: Prontuario): Promise<Prontuario> {
    const result = await prisma.prontuario.update({
      where: { id: prontuario.getId() },
      data: {
        tipo: prontuario.getTipoEvolucao(),
        evolucao: prontuario.getEvolucao(),
        data: prontuario.getData()
      }
    });

    return new Prontuario(
      result.id,
      result.pacienteId!,
      result.profissionalId!,
      result.usuarioId!,
      result.data!,
      result.evolucao!,
      result.tipo as TipoEvolucao
    );
  }

  async deletarPorId(id: number): Promise<void> {
    await prisma.prontuario.delete({
      where: { id }
    });
  }

  async buscarAtivoPorPacienteEProfissional(
    pacienteId: number,
    profissionalId: number
  ): Promise<Prontuario | null> {

    const prontuario = await prisma.prontuario.findFirst({
      where: {
        pacienteId,
        profissionalId
      },
      orderBy: {
        data: 'desc'
      }
    });

    if (!prontuario) return null;

    return new Prontuario(
      prontuario.id,
      prontuario.pacienteId,
      prontuario.profissionalId,
      prontuario.usuarioId,
      prontuario.data ?? new Date(),
      prontuario.evolucao ?? '',
      prontuario.tipo as TipoEvolucao
    );
  }

  async buscarCompleto(prontuarioId: number) {
    return prisma.prontuario.findUnique({
      where: { id: prontuarioId },
      include: {
        paciente: true,
        funcionario: true,
        avaliacao: {
          orderBy: { data: 'asc' },
          take: 1
        },
        evolucoes: {
          orderBy: { data: 'asc' }
        }
      }
    });
  }

  async buscarCompletoPorPacienteId(pacienteId: number) {
    return prisma.prontuario.findFirst({
      where: {
        pacienteId: pacienteId
      },
      include: {
        paciente: true,
        funcionario: true,
        avaliacao: true,
        evolucoes: {
          orderBy: { data: 'asc' }
        }
      }
    });
  }

}