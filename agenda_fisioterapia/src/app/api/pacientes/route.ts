import { NextResponse } from 'next/server';
import { PacienteService } from '@/services/PacienteService';
import { PacienteRepository } from '@/repositories/PacienteRepository';
import { Paciente } from '@/domain/entities/Paciente';
import { autorizar } from '@/shared/security/Authorization';
import { PerfilUsuario } from '@/domain/entities/Usuario';
import { JwtService } from '@/shared/security/JwtService';

const repositoryPaciente = new PacienteRepository();
const servicePaciente = new PacienteService(repositoryPaciente);

function getAuthPayload(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) throw new Error('Token não informado');

  const [, token] = authHeader.split(' ');

  if (!token) throw new Error('Token mal formatado');

  return JwtService.validarToken(token);
}

export async function GET(request: Request) {

  const payload = getAuthPayload(request);
  autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);

  const { searchParams } = new URL(request.url);
  const cpf = searchParams.get('cpf');
  const idParam = searchParams.get('id');
 //busca por id
if (idParam) {
     const id = Number(idParam);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      try {
      const paciente = await servicePaciente.buscarPorId(id);

      return NextResponse.json({
        id: paciente.getId(),
        nome: paciente.getNome(),
        dataNascimento: paciente.getDataNascimento(),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: paciente.getNumero(),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: paciente.getSexo(),
        estadoCivil: paciente.getEstadoCivil()
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    }
//busca por cpf
  if (cpf) {
    try {
      const paciente = await servicePaciente.buscarPorCpf(cpf);

      return NextResponse.json({
        id: paciente.getId(),
        nome: paciente.getNome(),
        dataNascimento: paciente.getDataNascimento(),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: paciente.getNumero(),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: paciente.getSexo(),
        estadoCivil: paciente.getEstadoCivil()
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }
  }

  // se não informar o cpf retorna todos
  const pacientes = await servicePaciente.listar();

  return NextResponse.json(
    pacientes.map(p => ({
      id: p.getId(),
      nome: p.getNome(),
      dataNascimento: p.getDataNascimento(),
      cep: p.getCep(),
      uf: p.getUf(),
      cidade: p.getCidade(),
      endereco: p.getEndereco(),
      numero: p.getNumero(),
      bairro: p.getBairro(),
      telefone: p.getTelefone(),
      celular: p.getCelular(),
      cpf: p.getCpf(),
      email: p.getEmail(),
      convenio: p.getConvenio(),
      sexo: p.getSexo(),
      estadoCivil: p.getEstadoCivil()
    }))
  );
}

export async function POST(request: Request) {
  try {
      const payload = getAuthPayload(request);
      autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);

    const body = await request.json();
    const paciente = await servicePaciente.cadastrar(body);

    return NextResponse.json(
      {
        id: paciente.getId(),
        nome: paciente.getNome(),
        dataNascimento: paciente.getDataNascimento(),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: paciente.getNumero(),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: paciente.getSexo(),
        estadoCivil: paciente.getEstadoCivil()
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
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('id');
  
  const payload = getAuthPayload(request);
  autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.RECEPCAO]);

  if (!idParam) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await servicePaciente.deletar(id);
    return NextResponse.json({ message: 'Paciente deletado com sucesso' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request){
  try{
     const payload = getAuthPayload(request);
     autorizar(payload.perfil, [PerfilUsuario.ADMIN, PerfilUsuario.PROFISSIONAL, PerfilUsuario.RECEPCAO]);
     const body = await request.json();

     //cria instancia do paciente
     const paciente = new Paciente(
       body.id,
       body.nome,
       body.dataNascimento,
       body.cep,
       body.uf,
       body.cidade,
       body.endereco,
       body.numero,
       body.bairro,
       body.telefone,
       body.celular,
       body.cpf,
       body.email,
       body.convenio,
       body.sexo,
       body.estadoCivil
     );

     const atualizado = await servicePaciente.atualizar(paciente);
     
     return NextResponse.json({
     id: paciente.getId(),
        nome: paciente.getNome(),
        dataNascimento: paciente.getDataNascimento(),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: paciente.getNumero(),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: paciente.getSexo(),
        estadoCivil: paciente.getEstadoCivil() 
     }, {status: 200});

  }catch(error: any){
     return NextResponse.json({error: error.message}, { status: 400 })
  }
}
