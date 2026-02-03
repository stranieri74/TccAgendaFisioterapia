import { NextResponse } from 'next/server';
import { UsuarioService } from '@/services/UsuarioService';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';

const repositoryUsuario = new UsuarioRepository();
const funcionarioRepository = new FuncionarioRepository();
const serviceUsuario = new UsuarioService(
  repositoryUsuario,
  funcionarioRepository
);


export async function POST(request: Request) {
  try {
    const body = await request.json();

    await serviceUsuario.recuperarSenha({
      email: body.email,
      cpf: body.cpf,
      cnpj: body.cnpj,
      crefito: body.crefito,
      novaSenha: body.novaSenha
    });

    return NextResponse.json(
      { message: 'Senha alterada com sucesso' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}