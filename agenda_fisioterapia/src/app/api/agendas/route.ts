import { NextResponse } from 'next/server';
import { autorizar } from '@/shared/security/Authorization';
import { JwtService } from '@/shared/security/JwtService';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { AgendaService } from '@/services/AgendaService';
import { AgendaRepository } from '@/repositories/AgendaRepository';
import { AgendaDiaRepository } from '@/repositories/AgendaDiaRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';

function getAuthPayload(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) throw new Error('Token não informado');

  const [, token] = authHeader.split(' ');

  if (!token) throw new Error('Token mal formatado');

  return JwtService.validarToken(token);
}

const agendaRepository = new AgendaRepository();
const agendaDiaRepository = new AgendaDiaRepository();
const pacienteRepository = new PacienteRepository();
const funcionarioRepository = new FuncionarioRepository();

const agendaService = new AgendaService(
  agendaRepository,
  agendaDiaRepository,
  pacienteRepository,
  funcionarioRepository
);

export async function GET(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');
    const pacienteId = searchParams.get('pacienteId');
    const profissionalId = searchParams.get('profissionalId');

    if (id) {
      const agenda = await agendaService.buscarPorId(Number(id));
      return NextResponse.json(agenda);
    }

    if (pacienteId) {
      const agendas = await agendaService.listarPorPaciente(
        Number(pacienteId)
      );
      return NextResponse.json(agendas);
    }

    if (profissionalId) {
      const agendas = await agendaService.listarPorProfissional(
        Number(profissionalId)
      );
      return NextResponse.json(agendas);
    }

    const agendas = await agendaService.listar();
    return NextResponse.json(agendas);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 403 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

    const body = await request.json();

    const agenda = await agendaService.cadastrar({
      pacienteId: body.pacienteId,
      profissionalId: body.profissionalId,
      usuarioId: payload.sub ? Number(payload.sub) : body.usuarioId,
      tipo: body.tipo,
      dias: body.dias
    });

    return NextResponse.json(agenda, { status: 201 });

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
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

    const body = await request.json();

    const agenda = await agendaService.atualizar({
      id: body.id,
      pacienteId: body.pacienteId,
      profissionalId: body.profissionalId,
      usuarioId: payload.sub ? Number(payload.sub) : body.usuarioId,
      tipo: body.tipo,
      dias: body.dias
    });

    return NextResponse.json(agenda);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    await agendaService.deletar(Number(id));

    return NextResponse.json(
      { message: 'Agenda removida com sucesso' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}
