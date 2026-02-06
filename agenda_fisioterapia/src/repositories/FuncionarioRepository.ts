import { prisma } from '@/prisma/infra/database/prisma';
import { Funcionario } from '@/domain/entities/Funcionario';


export class FuncionarioRepository {

  async salvar(funcionario: Funcionario): Promise<Funcionario> {
    const result = await prisma.funcionario.create({
      data: {
        nome: funcionario.getNome(),
        dataNascimento: new Date(funcionario.getDataNascimento()),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCnpj(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: Number(funcionario.getNumero()),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        crefito: funcionario.getCrefito(),
        sexo: funcionario.getSexo(),
        estadoCivil: funcionario.getEstadoCivil(),
        ativo: funcionario.getAtivo() ? 1 : 0
      }
    });
    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async listar(): Promise<Funcionario[]> {
    const funcionario = await prisma.funcionario.findMany();
    return funcionario.map(p =>
      new Funcionario(
        p.id,
        p.nome,
        p.dataNascimento,
        p.cep,
        p.cnpj,
        p.uf,
        p.cidade,
        p.endereco,
        p.numero,
        p.bairro,
        p.telefone,
        p.celular,
        p.cpf,
        p.email,
        p.crefito,
        p.sexo,
        p.estadoCivil,
        p.ativo
      )
    );
  }

  async buscarPorCrefito(crefito: string): Promise<Funcionario | null> {
    const result = await prisma.funcionario.findFirst({
      where: { crefito }
    });
    if (!result) return null;
    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async buscarPorCpf(cpf: string): Promise<Funcionario | null> {
    const result = await prisma.funcionario.findFirst({
      where: { cpf }
    });
    if (!result) return null;
    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async deletarPorId(id: number): Promise<void> {
    await prisma.funcionario.delete({
      where: { id },
    });
  }

  async buscarPorId(id: number): Promise<Funcionario | null> {
    const result = await prisma.funcionario.findUnique({
      where: { id },
    });

    if (!result) return null;

    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async atualizar(funcionario: Funcionario): Promise<Funcionario> {
    const result = await prisma.funcionario.update({
      where: { id: funcionario.getId() },
      data: {
        nome: funcionario.getNome(),
        dataNascimento: new Date(funcionario.getDataNascimento()),
        cep: funcionario.getCep(),
        cnpj: funcionario.getCnpj(),
        uf: funcionario.getUf(),
        cidade: funcionario.getCidade(),
        endereco: funcionario.getEndereco(),
        numero: Number(funcionario.getNumero()),
        bairro: funcionario.getBairro(),
        telefone: funcionario.getTelefone(),
        celular: funcionario.getCelular(),
        cpf: funcionario.getCpf(),
        email: funcionario.getEmail(),
        crefito: funcionario.getCrefito(),
        sexo: Number(funcionario.getSexo()),
        estadoCivil: Number(funcionario.getEstadoCivil()),
        ativo: funcionario.getAtivo() ? 1 : 0

      }
    });

    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async buscarPorCpfExcetoId(cpf: string, id: number): Promise<Funcionario | null> {
    const result = await prisma.funcionario.findFirst({
      where: {
        cpf: cpf,
        NOT: {
          id: id
        }
      }
    });

    if (!result) return null;

    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

  async buscarPorCrefitoExcetoId(crefito: string, id: number): Promise<Funcionario | null> {
    const result = await prisma.funcionario.findFirst({
      where: {
        crefito: crefito,
        NOT: {
          id: id
        }
      }
    });

    if (!result) return null;

    return new Funcionario(
      result.id,
      result.nome,
      result.dataNascimento,
      result.cep,
      result.cnpj,
      result.uf,
      result.cidade,
      result.endereco,
      result.numero,
      result.bairro,
      result.telefone,
      result.celular,
      result.cpf,
      result.email,
      result.crefito,
      result.sexo,
      result.estadoCivil,
      result.ativo
    );
  }

}