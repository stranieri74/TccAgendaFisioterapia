import { NextResponse } from 'next/server';
import { ProntuarioService } from '@/services/ProntuarioService';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { Prontuario, TipoEvolucao } from '@/domain/entities/Prontuario';
import { JwtService } from '@/shared/security/JwtService';

function getAuthPayload(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) throw new Error('Token não informado');

  const [, token] = authHeader.split(' ');

  if (!token) throw new Error('Token mal formatado');

  return JwtService.validarToken(token);
}

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
    const profissionalIdParam = searchParams.get('profissionalId');

    if (profissionalIdParam) {
      const profissionalId = Number(profissionalIdParam);
      if (isNaN(profissionalId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      try {
        const prontuarios = await serviceProntuario.listarPorProfissional(profissionalId);
        return NextResponse.json(prontuarios);
      } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 404 });
      }
    }

   const pacienteIdParam = searchParams.get('pacienteId');
   
   if (pacienteIdParam) {
  const pacienteId = Number(pacienteIdParam);
  if (isNaN(pacienteId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const prontuarios = await serviceProntuario.listarPorPaciente(pacienteId);
    return NextResponse.json(prontuarios);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }


} 


const tipoParam = searchParams.get('tipo');
  if (pacienteIdParam) {
    if (!tipoParam) {
      return NextResponse.json({ error: 'Tipo é obrigatório' }, { status: 400 });
    }
 // converter string para enum
    const tipo = tipoParam as TipoEvolucao;
    const prontuariosTipo = await serviceProntuario.listarPorTipo(tipo);

    return NextResponse.json(
      prontuariosTipo.map(p => ({
        id: p.getId(),
        pacienteId: p.getPacienteId(),
        profissionalId: p.getProfissionalId(),
        usuarioId: p.getUsuarioId(),
        data: p.getData(),
        tipo: p.getTipoEvolucao(),
        evolucao: p.getEvolucao()
      }))
    );
  }   
    const prontuarios = await serviceProntuario.listar();
    return NextResponse.json(prontuarios);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 403 });
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