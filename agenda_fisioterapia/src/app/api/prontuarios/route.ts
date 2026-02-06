import { NextResponse } from 'next/server';
import { ProntuarioService } from '@/services/ProntuarioService';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';
import { getAuthPayload } from '@/middlewares/auth.middleware';

const repositoryProntuario = new ProntuarioRepository();
const repositoryPaciente = new PacienteRepository();
const repositoryFuncionario = new FuncionarioRepository();
const serviceProntuario = new ProntuarioService(
  repositoryProntuario,
  repositoryPaciente,
  repositoryFuncionario
);

export async function GET(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL]);
    const { searchParams } = new URL(request.url);

    const idParam = searchParams.get('id');
    const pacienteIdParam = searchParams.get('pacienteId');
    const profissionalIdParam = searchParams.get('profissionalId');
    const tipoParam = searchParams.get('tipo');
    const cpfParam = searchParams.get('cpf');

    // Buscar prontuário por ID (rota antiga separada)
    if (idParam) {
      const id = Number(idParam);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const prontuario = await serviceProntuario.obterProntuario(id);
      return NextResponse.json(prontuario);
    }
    if (cpfParam) {
      const cpf = cpfParam.replace(/\D/g, '');

      if (cpf.length !== 11) {
        return NextResponse.json(
          { error: 'CPF inválido' },
          { status: 400 }
        );
      }

      const prontuario =
        await serviceProntuario.obterProntuarioPorCpf(cpf);

      return NextResponse.json(prontuario);
    }

    // Listar por profissional
    if (profissionalIdParam) {
      const profissionalId = Number(profissionalIdParam);
      if (isNaN(profissionalId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const prontuarios =
        await serviceProntuario.listarPorProfissional(profissionalId);

      return NextResponse.json(prontuarios);
    }

    // Listar por paciente + tipo
    if (pacienteIdParam && tipoParam) {
      const pacienteId = Number(pacienteIdParam);
      if (isNaN(pacienteId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const tipo = tipoParam as TipoEvolucao;

      const prontuarios =
        await serviceProntuario.listarPorTipo(
          tipo
        );

      return NextResponse.json(prontuarios);
    }

    // Listar por paciente
    if (pacienteIdParam) {
      const pacienteId = Number(pacienteIdParam);
      if (isNaN(pacienteId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const prontuarios =
        await serviceProntuario.listarPorPaciente(pacienteId);

      return NextResponse.json(prontuarios);
    }

    // Listar todos
    const prontuarios = await serviceProntuario.listar();
    return NextResponse.json(prontuarios);

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
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL]);

    const body = await request.json();

    const prontuario = await serviceProntuario.cadastrar({
      pacienteId: body.pacienteId,
      profissionalId: body.profissionalId,
      usuarioId: body.usuarioId,
      data: new Date(body.data),
      tipo: body.tipo,
      evolucao: body.evolucao
    });

    return NextResponse.json(prontuario, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL]);

    const body = await request.json();

    const prontuario = new Prontuario(
      body.id,
      body.pacienteId,
      body.profissionalId,
      body.usuarioId,
      new Date(body.data),
      body.evolucao,
      body.tipo
    );

    const atualizado = await serviceProntuario.atualizar(prontuario);
    return NextResponse.json(atualizado, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL]);

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    const id = Number(idParam);
    if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    await serviceProntuario.deletar(id);
    return NextResponse.json({ message: 'Prontuário deletado com sucesso' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}