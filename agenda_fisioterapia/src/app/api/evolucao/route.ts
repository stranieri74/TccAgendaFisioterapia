import { NextResponse } from 'next/server';
import { EvolucaoService } from '@/services/EvolucaoService';
import { EvolucaoRepository } from '@/repositories/EvolucaoRepository';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { AgendaDiaRepository } from '@/repositories/AgendaDiaRepository';
import { AgendaRepository } from '@/repositories/AgendaRepository';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { getAuthPayload } from '@/middlewares/auth.middleware';

const evolucaoRepository = new EvolucaoRepository();
const prontuarioRepository = new ProntuarioRepository();
const agendaDiaRepository = new AgendaDiaRepository();
const agendaRepository = new AgendaRepository();

const service = new EvolucaoService(
  evolucaoRepository,
  prontuarioRepository,
  agendaDiaRepository,
  agendaRepository
);

export async function POST(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);

    const body = await request.json();
    const evolucao = await service.cadastrar(body);

    return NextResponse.json(evolucao, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {

    const payload = getAuthPayload(request);

    autorizar(payload.perfil, [
      PerfilUsuario.ADMIN,
      PerfilUsuario.PROFISSIONAL
    ]);

    const { searchParams } = new URL(request.url);

    const hoje = searchParams.get('hoje');
    const profissionalId = Number(searchParams.get('profissionalId'));
    const Id = Number(searchParams.get('Id'));
    if (!profissionalId) {

      return NextResponse.json(
        await service
          .listarEvolucaoId(
            Id
          )
      );
    }

    // EVOLUÇÕES DO DIA — FISIOTERAPIA
    if (hoje === 'true' && profissionalId) {

      return NextResponse.json(
        await service
          .listarFisioterapiaHojePorProfissional(
            profissionalId
          )
      );
    }

    return NextResponse.json([]);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);
    const body = await request.json();

    const evolucao = await service.atualizar({
      id: Number(body.id),
      agendaDiaId: Number(body.agendaDiaId),
      conduta: body.conduta,
      exercicios: body.exercicios,
      recursos: body.recursos,
      respostaPaciente: body.respostaPaciente,
      data: body.data,
      observacoes: body.observacoes,
      alta: body.alta
    });

    return NextResponse.json(evolucao);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}



