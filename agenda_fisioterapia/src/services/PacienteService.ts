import { Paciente } from '@/domain/entities/Paciente';
import { PacienteRepository } from '@/repositories/PacienteRepository';

export class PacienteService{
   constructor(private repository: PacienteRepository){}

   async cadastrar(dados: {
               nome: string,
               dataNascimento: Date,
               cep: string,
               uf: string,
               cidade: string,
               endereco: string,
               numero: number,
               bairro: string,
               telefone: string,
               celular: string,
               cpf: string,
               email: string,
               convenio: string,
               sexo: number,
               estadoCivil: number
   }): Promise<Paciente> {
  if (!dados.nome?.trim()) {
    throw new Error('Nome é obrigatório');
  }

  if (!dados.cep?.trim()) {
    throw new Error('CEP é obrigatório');
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

  if (!dados.email?.trim()) {
    throw new Error('email é obrigatório');
  }

  if (!dados.convenio?.trim()) {
    throw new Error('Convenio é obrigatório');
  }

  // checando se o paciente já existe
  const cpfExistente = await this.repository.buscarPorCpf(dados.cpf);
  if (cpfExistente) {
     throw new Error('Já existe paciente cadastrado com este CPF');
    }
    
    const paciente = new Paciente(
      0,
      dados.nome,
      dados.dataNascimento,
      dados.cep,
      dados.uf,
      dados.cidade,
      dados.endereco,
      dados.numero,
      dados.bairro,
      dados.telefone,
      dados.celular,
      dados.cpf,
      dados.email,
      dados.convenio,
      dados.sexo,
      dados.estadoCivil
    );

    return await this.repository.salvar(paciente);
  }

async listar(): Promise<Paciente[]> {
    return this.repository.listar();
  }

  async buscarPorCpf(cpf: string): Promise<Paciente> {
    if (!cpf?.trim()) {
      throw new Error('CPF é obrigatório para a busca');
    }

    const paciente = await this.repository.buscarPorCpf(cpf);

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    return paciente;
  }

  async buscarPorId(id: number): Promise<Paciente> {
   if ( id== null || id <= 0) {
      throw new Error('ID é obrigatório para a busca');
    }

    const paciente = await this.repository.buscarPorId(id);

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

  return paciente;
}
  
  async deletar(id: number): Promise<void> {
    //verifico se existe antes de deletar
    const pacienteExistente = await this.repository.buscarPorId(id);
    if(!pacienteExistente){
      throw new Error('Paciente não encontrado');
    }
    await this.repository.deletarPorId(id);
  }

  async atualizar(dados: Paciente): Promise<Paciente>{
    const pacienteExistente = await this.repository.buscarPorId(dados.getId());
    if(!pacienteExistente) {
      throw new Error('Paciente não encontrado');
    }
    const cpfEmUso = await this.repository.buscarPorCpfExcetoId(
                                                                dados.getCpf(),
                                                                dados.getId()
                                                               );

    if (cpfEmUso) {
       throw new Error('CPF já cadastrado para outro paciente');
      }

    return await this.repository.atualizar(dados);
  }
 
}

