import { prisma } from '@/prisma/infra/database/prisma';
import { Paciente } from '@/domain/entities/Paciente';


export class PacienteRepository {

  async salvar(paciente: Paciente): Promise<Paciente> {
    const result = await prisma.paciente.create({
      data: {
        nome: paciente.getNome(),
        dataNascimento: new Date(paciente.getDataNascimento()),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: Number(paciente.getNumero()),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: paciente.getSexo(),
        estadoCivil: paciente.getEstadoCivil()
      }
    });

    return new Paciente(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.convenio,
      result.sexo,
      result.estadoCivil
    );
  }


  async listar(): Promise<Paciente[]> {
    const pacientes = await prisma.paciente.findMany();
    return pacientes.map(p =>
      new Paciente(
        p.id,
        p.nome,
        p.dataNascimento,
        p.cep,
        p.uf,
        p.cidade,
        p.endereco,
        p.numero,
        p.bairro,
        p.telefone,
        p.celular,
        p.cpf,
        p.email,
        p.convenio,
        p.sexo,
        p.estadoCivil
      )
    );
  }

  async buscarPorCpf(cpf: string): Promise<Paciente | null> {
    const result = await prisma.paciente.findFirst({
      where: { cpf }
    });
    if (!result) return null;
    return new Paciente(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.convenio,
      result.sexo,
      result.estadoCivil
    );
  }

  async deletarPorId(id: number): Promise<void> {
    await prisma.paciente.delete({
      where: { id },
    });
  }

  async buscarPorId(id: number): Promise<Paciente | null> {
    const result = await prisma.paciente.findUnique({
      where: { id },
    });

    if (!result) return null;

    return new Paciente(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.convenio,
      result.sexo,
      result.estadoCivil
    );
  }

  async atualizar(paciente: Paciente): Promise<Paciente> {
    const result = await prisma.paciente.update({
      where: { id: paciente.getId() },
      data: {
        nome: paciente.getNome(),
        dataNascimento: new Date(paciente.getDataNascimento()),
        cep: paciente.getCep(),
        uf: paciente.getUf(),
        cidade: paciente.getCidade(),
        endereco: paciente.getEndereco(),
        numero: Number(paciente.getNumero()),
        bairro: paciente.getBairro(),
        telefone: paciente.getTelefone(),
        celular: paciente.getCelular(),
        cpf: paciente.getCpf(),
        email: paciente.getEmail(),
        convenio: paciente.getConvenio(),
        sexo: Number(paciente.getSexo()),
        estadoCivil: Number(paciente.getEstadoCivil())

      }
    });

    return new Paciente(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.convenio,
      result.sexo,
      result.estadoCivil
    );
  }

  async buscarPorCpfExcetoId(cpf: string, id: number): Promise<Paciente | null> {
    const result = await prisma.paciente.findFirst({
      where: {
        cpf: cpf,
        NOT: {
          id: id
        }
      }
    });

    if (!result) return null;

    return new Paciente(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.convenio,
      result.sexo,
      result.estadoCivil
    );
  }

}