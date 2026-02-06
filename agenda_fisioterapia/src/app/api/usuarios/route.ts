import { NextResponse } from 'next/server';
import { UsuarioService } from '@/services/UsuarioService';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { Usuario } from '@/domain/entities/Usuario';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { autorizar } from '@/shared/security/Authorization';
import { getAuthPayload } from '@/middlewares/auth.middleware';

const repositoryUsuario = new UsuarioRepository();
const funcionarioRepository = new FuncionarioRepository();
const serviceUsuario = new UsuarioService(
  repositoryUsuario,
  funcionarioRepository
);

// GET
export async function GET(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN]);

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const login = searchParams.get('login');

    // BUSCAR POR ID

    if (idParam) {
      const id = Number(idParam);

      if (isNaN(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const usuario: any = await serviceUsuario.buscarPorId(id);

      return NextResponse.json({
        id: usuario.id,
        login: usuario.login,
        perfil: usuario.perfil,
        ativo: Number(usuario.ativo) === 1,
        funcionarioId: usuario.funcionarioId,
        funcionario: usuario.funcionario
      });
    }

    // BUSCAR POR LOGIN
    if (login) {
      const usuario: any = await serviceUsuario.buscarPorLogin(login);

      return NextResponse.json({
        id: usuario.id,
        login: usuario.login,
        perfil: usuario.perfil,
        ativo: Number(usuario.ativo) === 1,
        funcionarioId: usuario.funcionarioId,
        funcionario: usuario.funcionario
      });
    }

    // LISTAR TODOS
    const usuarios: any[] = await serviceUsuario.listar();

    return NextResponse.json(
      usuarios.map(u => ({
        id: u.id,
        login: u.login,
        perfil: u.perfil,
        ativo: Number(u.ativo) === 1,
        funcionarioId: u.funcionarioId,
        funcionario: u.funcionario
      }))
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 403 }
    );
  }
}

// POST
export async function POST(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN]);

    const body = await request.json();

    const usuario: any = await serviceUsuario.cadastrar({
      login: body.login,
      senha: body.senha,
      perfil: body.perfil as PerfilUsuario,
      ativo: body.ativo,
      funcionarioId: body.funcionarioId
    });

    return NextResponse.json(
      {
        id: usuario.id,
        login: usuario.login,
        perfil: usuario.perfil,
        ativo: Number(usuario.ativo) === 1,
        funcionarioId: usuario.funcionarioId,
        funcionario: usuario.funcionario
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN]);

    const body = await request.json();

    const usuario = new Usuario(
      body.id,
      body.login,
      '',
      body.perfil as PerfilUsuario,
      body.ativo,
      body.funcionarioId
    );
    (usuario as any).senha = body.senha;

    const atualizado: any = await serviceUsuario.atualizar(usuario);

    return NextResponse.json({
      id: atualizado.id,
      login: atualizado.login,
      perfil: atualizado.perfil,
      ativo: Number(atualizado.ativo) === 1,
      funcionarioId: atualizado.funcionarioId,
      funcionario: atualizado.funcionario
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: 'Usuário ou senha inválidos' },
      { status: 400 }
    );
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN]);

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await serviceUsuario.deletar(id);

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    );
  }
}