import { Funcionario } from '@/domain/entities/Funcionario';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { validarCPF, validarCNPJ, validarEmail } from '@/shared/utils/funcaoValidacao';

export class FuncionarioService {
  constructor(private repository: FuncionarioRepository) { }

  async cadastrar(dados: {
    nome: string,
    dataNascimento: Date,
    cep: string,
    cnpj: string,
    uf: string,
    cidade: string,
    endereco: string,
    numero: number,
    bairro: string,
    telefone: string,
    celular: string,
    cpf: string,
    email: string,
    crefito: string,
    sexo: number,
    estadoCivil: number,
    ativo: number

  }): Promise<Funcionario> {
    if (!dados.nome?.trim()) {
      throw new Error('Nome é obrigatório');
    }

    if (!dados.cep?.trim()) {
      throw new Error('CEP é obrigatório');
    }

    if (!dados.cnpj?.trim()) {
      throw new Error('CNPJ é obrigatório');
    }

    if (!validarCNPJ(dados.cnpj?.trim())) {
      throw new Error('CNPJ inválido');
    }

    if (!dados.uf?.trim()) {
      throw new Error('Estado é obrigatório');
    }

    if (!dados.cidade?.trim()) {
      throw new Error('Cidade é obrigatório');
    }

    if (!dados.endereco?.trim()) {
      throw new Error('Endereço é obrigatório');
    }

    if (dados.numero == null || dados.numero <= 0) {
      throw new Error('Numero é obrigatório');
    }

    if (!dados.bairro?.trim()) {
      throw new Error('Bairro é obrigatório');
    }

    if (!dados.telefone?.trim()) {
      throw new Error('Telefone é obrigatório');
    }

    if (!dados.celular?.trim()) {
      throw new Error('Celular é obrigatório');
    }

    if (!dados.cpf?.trim()) {
      throw new Error('Cpf é obrigatório');
    }

    if (!validarCPF(dados.cpf?.trim())) {
      throw new Error('Cpf inválido');
    }

    if (!dados.email?.trim()) {
      throw new Error('email é obrigatório');
    }

    if (!validarEmail(dados.email?.trim())) {
      throw new Error('Email inválido');
    }

    if (!dados.crefito?.trim()) {
      throw new Error('Crefito é obrigatório');
    }

    // checando se o crefito já existe
    const crefitoExistente = await this.repository.buscarPorCrefito(dados.crefito);
    if (crefitoExistente) {
      throw new Error('Já existe funcionário cadastrado com este Crefito');
    }

    const funcionario = new Funcionario(
      0,
      dados.nome,
      dados.dataNascimento,
      dados.cep,
      dados.cnpj,
      dados.uf,
      dados.cidade,
      dados.endereco,
      dados.numero,
      dados.bairro,
      dados.telefone,
      dados.celular,
      dados.cpf,
      dados.email,
      dados.crefito,
      dados.sexo,
      dados.estadoCivil,
      dados.ativo
    );

    return await this.repository.salvar(funcionario);
  }

  async listar(): Promise<Funcionario[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Funcionario> {
    if (id == null || id <= 0) {
      throw new Error('crefito é obrigatório para a busca');
    }

    const funcionario = await this.repository.buscarPorId(id);

    if (!funcionario) {
      throw new Error('Funcionário não encontrado');
    }

    return funcionario;
  }

  async buscarPorCpf(cpf: string): Promise<Funcionario> {
    if (!cpf?.trim()) {
      throw new Error('CPF é obrigatório para a busca');
    }

    const funcionario = await this.repository.buscarPorCpf(cpf);

    if (!funcionario) {
      throw new Error('Funcionário não encontrado');
    }

    return funcionario;
  }

  async buscarPorCrefito(crefito: string): Promise<Funcionario> {
    if (!crefito?.trim()) {
      throw new Error('crefito é obrigatório para a busca');
    }

    const funcionario = await this.repository.buscarPorCrefito(crefito);

    if (!funcionario) {
      throw new Error('Funcionário não encontrado');
    }

    return funcionario;
  }


  async deletar(id: number): Promise<void> {
    //verifico se existe antes de deletar
    const funcionarioExistente = await this.repository.buscarPorId(id);
    if (!funcionarioExistente) {
      throw new Error('Funcionário não encontrado');
    }
    await this.repository.deletarPorId(id);
  }

  async atualizar(dados: Funcionario): Promise<Funcionario> {
    if (!dados.getNome()?.trim()) {
      throw new Error('Nome é obrigatório');
    }

    if (!dados.getCep()?.trim()) {
      throw new Error('CEP é obrigatório');
    }

    if (!dados.getCnpj()?.trim()) {
      throw new Error('CNPJ é obrigatório');
    }

    if (!validarCNPJ(dados.getCnpj()?.trim())) {
      throw new Error('Cpf inválido');
    }

    if (!dados.getUf()?.trim()) {
      throw new Error('Estado é obrigatório');
    }

    if (!dados.getCidade()?.trim()) {
      throw new Error('Cidade é obrigatório');
    }

    if (!dados.getEndereco()?.trim()) {
      throw new Error('Endereço é obrigatório');
    }

    if (dados.getNumero() == null || dados.getNumero() <= 0) {
      throw new Error('Numero é obrigatório');
    }

    if (!dados.getBairro()?.trim()) {
      throw new Error('Bairro é obrigatório');
    }

    if (!dados.getTelefone()?.trim()) {
      throw new Error('Telefone é obrigatório');
    }

    if (!dados.getCelular()?.trim()) {
      throw new Error('Celular é obrigatório');
    }

    if (!dados.getCpf()?.trim()) {
      throw new Error('Cpf é obrigatório');
    }

    if (!validarCPF(dados.getCpf()?.trim())) {
      throw new Error('Cpf inválido');
    }

    if (!dados.getEmail()?.trim()) {
      throw new Error('email é obrigatório');
    }

    if (!validarEmail(dados.getEmail()?.trim())) {
      throw new Error('Email inválido');
    }

    if (!dados.getCrefito()?.trim()) {
      throw new Error('Crefito é obrigatório');
    }

    const funcionarioExistente = await this.repository.buscarPorId(dados.getId());
    if (!funcionarioExistente) {
      throw new Error('Funcionário não encontrado');
    }
    const cpfEmUso = await this.repository.buscarPorCpfExcetoId(
      dados.getCpf(),
      dados.getId()
    );

    if (cpfEmUso) {
      throw new Error('CPF já cadastrado para outro Funcionário');
    }

    const crefitoEmUso = await this.repository.buscarPorCpfExcetoId(
      dados.getCrefito(),
      dados.getId()
    );

    if (crefitoEmUso) {
      throw new Error('Crefito já cadastrado para outro Funcionário');
    }

    return await this.repository.atualizar(dados);
  }

}

