import { NextResponse } from 'next/server';
import { AvaliacaoService } from '@/services/Avaliacao.service';
import { AvaliacaoRepository } from '@/repositories/AvaliacaoRepository';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { AgendaRepository } from '@/repositories/AgendaRepository';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { getAuthPayload } from '@/middlewares/auth.middleware';

const avaliacaoRepository = new AvaliacaoRepository();
const prontuarioRepository = new ProntuarioRepository();
const agendaRepository = new AgendaRepository();

const service = new AvaliacaoService(
  avaliacaoRepository,
  prontuarioRepository,
  agendaRepository
);

export async function POST(request: Request) {
  try {

    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [
      PerfilUsuario.ADMIN,
      PerfilUsuario.PROFISSIONAL
    ]);

    const body = await request.json();

    // método correto
    const avaliacao = await service.cadastrar(body);

    return NextResponse.json(avaliacao, { status: 201 });

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
      PerfilUsuario.PROFISSIONAL,
      PerfilUsuario.RECEPCAO
    ]);

    const { searchParams } = new URL(request.url);
    const agendaId = Number(searchParams.get('agendaId'));

    if (!agendaId) {
      return NextResponse.json(
        { message: 'agendaId é obrigatório' },
        { status: 400 }
      );
    }

    const avaliacao = await service.buscarPorAgendaId(agendaId);

    // NÃO ENCONTROU
    if (!avaliacao) {
      return NextResponse.json(
        { message: 'Avaliação não encontrada para esta agenda' },
        { status: 404 }
      );
    }

    return NextResponse.json(avaliacao);

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
    autorizar(payload.perfil, [
      PerfilUsuario.ADMIN,
      PerfilUsuario.PROFISSIONAL
    ]);

    const body = await request.json();

    const avaliacao = await service.atualizar(body);

    return NextResponse.json(avaliacao);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}