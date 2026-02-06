import { NextResponse } from 'next/server';
import { UsuarioService } from '@/services/UsuarioService';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';

const usuarioRepository = new UsuarioRepository();
const funcionarioRepository = new FuncionarioRepository();
const usuarioService = new UsuarioService(
  usuarioRepository,
  funcionarioRepository
);

//Preflight (CORS)

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

//Login

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login, senha } = body;

    if (!login || !senha) {
      return NextResponse.json(
        { message: 'Login e senha são obrigatórios' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:4200'
          }
        }
      );
    }

    const { usuario, token } = await usuarioService.autenticar(login, senha);

    return NextResponse.json(
      {
        token,
        usuario: {
          id: usuario.getId(),
          login: usuario.getLogin(),
          perfil: usuario.getPerfil(),
          ativo: usuario.isAtivo(),
          funcionarioId: usuario.getFuncionarioId()
        }
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4200',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4200'
        }
      }
    );
  }
}