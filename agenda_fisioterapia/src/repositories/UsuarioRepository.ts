import { prisma } from '@/prisma/infra/database/prisma';
import { Usuario } from '@/domain/entities/Usuario';
import { PerfilUsuario } from '@/domain/entities/Usuario';

export class UsuarioRepository {

    async salvar(usuario: Usuario): Promise<Usuario> {
        const result = await prisma.usuario.create({
           data: {
                  login: usuario.getLogin(),
                  senhaHash: usuario.getSenhaHash(),
                  perfil: usuario.getPerfil(),
                  ativo: usuario.isAtivo() ? 1 : 0,
                  funcionario:{
                    connect: {
                        id: usuario.getFuncionarioId()
                    }
                  }
           }    
        });

       return new Usuario(
           result.id,
           result.login,
           result.senhaHash,
           result.perfil as PerfilUsuario,
           Boolean(result.ativo),
           result.funcionarioId
       );
    }


async listar(): Promise<Usuario[]> {
  const usuarios = await prisma.usuario.findMany({
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

  return usuarios.map(p =>
    new Usuario(
      p.id,
      p.login,
      p.senhaHash,
      p.perfil as PerfilUsuario,
      Boolean(p.ativo),
      p.funcionarioId
    )
  );
}

async buscarPorLogin(login: string): Promise<Usuario | null>{
   const result = await prisma.usuario.findUnique({
    where: { login },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    
   });

   if (!result) return null;

   return new Usuario(
    result.id,
    result.login,
    result.senhaHash,
    result.perfil as PerfilUsuario,
    Boolean( result.ativo),
    result.funcionarioId
   );
}

async deletarPorId(id: number): Promise<void> {
  await prisma.usuario.delete({
    where: { id }
  });
}

  async buscarPorId(id: number): Promise<Usuario | null> {
    const result = await prisma.usuario.findUnique({
      where: { id },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!result) return null;

    return new Usuario(
      result.id,
      result.login,
      result.senhaHash,
      result.perfil as PerfilUsuario,
      Boolean(result.ativo),
      result.funcionarioId
    );
  }

  async buscarPorLoginExcetoId(
    login: string,
    id: number
  ): Promise<Usuario | null> {

    const result = await prisma.usuario.findFirst({
      where: {
        login,
        NOT: {
          id
        }
      },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!result) return null;

    return new Usuario(
      result.id,
      result.login,
      result.senhaHash,
      result.perfil as PerfilUsuario,
      Boolean(result.ativo),
      result.funcionarioId
    );
  }

async atualizar(usuario: Usuario): Promise<Usuario> {
  const result = await prisma.usuario.update({
    where: { id: usuario.getId() },
    data: {
      login: usuario.getLogin(),
      senhaHash: usuario.getSenhaHash(),
      perfil: usuario.getPerfil(),
      ativo: usuario.isAtivo() ? 1 : 0,
      funcionario: {
        connect: {
          id: usuario.getFuncionarioId()
        }
      }
    },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
  });

  return new Usuario(
    result.id,
    result.login,
    result.senhaHash,
    result.perfil as PerfilUsuario,
    Boolean(result.ativo),
    result.funcionarioId
  );
}

async listarComFuncionario() {
  return await prisma.usuario.findMany({
    include: {
      funcionario: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
}

// ==============================
// BUSCA POR ID PARA TELA
// ==============================
async buscarPorIdComFuncionario(id: number) {
  return await prisma.usuario.findUnique({
    where: { id },
    include: {
      funcionario: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
}

async buscarParaRecuperacao(dados: {
    email: string;
    cpf?: string;
    cnpj?: string;
    crefito: string;
  }) {

    return prisma.usuario.findFirst({
      where: {
        funcionario: {
          email: dados.email,
          crefito: dados.crefito,
          OR: [
            { cpf: dados.cpf },
            { cnpj: dados.cnpj }
          ]
        }
      },
      include: {
        funcionario: true
      }
    });
  }

  async atualizarSenha(
    usuarioId: number,
    senhaHash: string
  ) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: { senhaHash }
    });
  }
}

