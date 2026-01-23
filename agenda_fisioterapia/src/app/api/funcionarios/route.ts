import { NextResponse } from 'next/server';
import { FuncionarioService } from '@/services/FuncionarioService';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { Funcionario } from '@/domain/entities/Funcionario';
import { JwtService } from '@/shared/security/JwtService';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';

function getAuthPayload(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) throw new Error('Token não informado');

  const [, token] = authHeader.split(' ');

  if (!token) throw new Error('Token mal formatado');

  return JwtService.validarToken(token);
}

const repositoryFuncionario = new FuncionarioRepository();
const funcionarioService = new FuncionarioService(repositoryFuncionario);

export async function GET(request: Request) {

  const payload = getAuthPayload(request);
  autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);

  const { searchParams } = new URL(request.url);
  const cpf = searchParams.get('cpf');
  const crefito = searchParams.get('crefito');

    const idParam = searchParams.get('id');
   //busca por id
  if (idParam) {
       const id = Number(idParam);
        if (isNaN(id)) {
          return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }
  
        try {
        const funcionario = await funcionarioService.buscarPorId(id);
  
        return NextResponse.json({
          id: funcionario.getId(),
          nome: funcionario.getNome(),
          dataNascimento: funcionario.getDataNascimento(),
          cep: funcionario.getCep(),
          cnpj: funcionario.getCnpj(),
          uf: funcionario.getUf(),
          cidade: funcionario.getCidade(),
          endereco: funcionario.getEndereco(),
          numero: funcionario.getNumero(),
          bairro: funcionario.getBairro(),
          telefone: funcionario.getTelefone(),
          celular: funcionario.getCelular(),
          cpf: funcionario.getCpf(),
          email: funcionario.getEmail(),
          crefito: funcionario.getCrefito(),
          sexo: funcionario.getSexo(),
          estadoCivil: funcionario.getEstadoCivil(),
          ativo: funcionario.getAtivo()
        });
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
  
      }

  if (cpf) {
    try {
      const funcionario = await funcionarioService.buscarPorCpf(cpf);

      return NextResponse.json({
        id: funcionario.getId(),
        nome: funcionario.getNome(),
        dataNascimento: funcionario.getDataNascimento(),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCnpj(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: funcionario.getNumero(),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        crefito: funcionario.getCrefito(),
        sexo: funcionario.getSexo(),
        estadoCivil: funcionario.getEstadoCivil(),
        ativo: funcionario.getAtivo()
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }
  }

    if (crefito) {
    try {
      const funcionario = await funcionarioService.buscarPorCrefito(crefito);

      return NextResponse.json({
        id: funcionario.getId(),
        nome: funcionario.getNome(),
        dataNascimento: funcionario.getDataNascimento(),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCnpj(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: funcionario.getNumero(),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        crefito: funcionario.getCrefito(),
        sexo: funcionario.getSexo(),
        estadoCivil: funcionario.getEstadoCivil(),
        ativo: funcionario.getAtivo()
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }
  }

  // se não informar o cpf retorna todos
  const funcionario = await funcionarioService.listar();

  return NextResponse.json(
    funcionario.map(p => ({
      id: p.getId(),
      nome: p.getNome(),
      dataNascimento: p.getDataNascimento(),
      cep: p.getCep(),
      cnpj: p.getCnpj(),
      uf: p.getUf(),
      cidade: p.getCidade(),
      endereco: p.getEndereco(),
      numero: p.getNumero(),
      bairro: p.getBairro(),
      telefone: p.getTelefone(),
      celular: p.getCelular(),
      cpf: p.getCpf(),
      email: p.getEmail(),
      crefito: p.getCrefito(),
      sexo: p.getSexo(),
      estadoCivil: p.getEstadoCivil(),
      ativo: p.getAtivo
    }))
  );
}

export async function POST(request: Request) {
  try {
    const payload = getAuthPayload(request);
    autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

    const body = await request.json();
    const funcionario = await funcionarioService.cadastrar(body);

    return NextResponse.json(
      {
        id: funcionario.getId(),
        nome: funcionario.getNome(),
        dataNascimento: funcionario.getDataNascimento(),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCnpj(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: funcionario.getNumero(),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        convenio: funcionario.getCrefito(),
        sexo: funcionario.getSexo(),
        estadoCivil: funcionario.getEstadoCivil(),
        ativo: funcionario.getAtivo()
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

export async function DELETE(request: Request) {

    const payload = getAuthPayload(request);
  autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('id');

  if (!idParam) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await funcionarioService.deletar(id);
    return NextResponse.json({ message: 'Paciente deletado com sucesso' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request){
  try{
      const payload = getAuthPayload(request);
      autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

     const body = await request.json();
     const funcionario = new Funcionario(
       body.id,
       body.nome,
       body.dataNascimento,
       body.cep,
       body.cnpj,
       body.uf,
       body.cidade,
       body.endereco,
       body.numero,
       body.bairro,
       body.telefone,
       body.celular,
       body.cpf,
       body.email,
       body.crefito,
       body.sexo,
       body.estadoCivil,
       body.ativo
     );

     const atualizado = await funcionarioService.atualizar(funcionario);
     
     return NextResponse.json({
     id: funcionario.getId(),
        nome: funcionario.getNome(),
        dataNascimento: funcionario.getDataNascimento(),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCrefito(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: funcionario.getNumero(),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        crefito: funcionario.getCrefito(),
        sexo: funcionario.getSexo(),
        estadoCivil: funcionario.getEstadoCivil(),
        ativo: funcionario.getAtivo() 
     }, {status: 200});

  }catch(error: any){
     return NextResponse.json({error: error.message}, { status: 400 })
  }
}
