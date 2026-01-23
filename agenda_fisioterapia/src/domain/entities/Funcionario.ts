export class Funcionario {
    private id: number;
    private nome: string;
    private dataNascimento: Date;
    private cep: string;
    private cnpj: string;
    private uf: string;
    private cidade: string;
    private endereco: string;
    private numero: number;
    private bairro: string;
    private telefone: string;
    private celular: string;
    private cpf: string;
    private email: string;
    private crefito: string;
    private sexo: number;
    private estadoCivil: number;
    private ativo: number;

    constructor(id: number,
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
              ativo: number){
            this.id = id;
            this.nome = nome;
            this.dataNascimento = dataNascimento;
            this.cep = cep;
            this.cnpj = cnpj
            this.uf = uf;
            this.cidade = cidade;
            this.endereco = endereco;
            this.numero = numero;
            this.bairro = bairro;
            this.telefone = telefone;
            this.celular = celular;
            this.cpf = cpf;
            this.email = email;
            this.crefito = crefito;
            this.sexo = sexo;
            this.estadoCivil = estadoCivil;
            this.ativo = ativo;

   }

  getId(): number {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getDataNascimento(): Date {
    return this.dataNascimento;
  }

  getCep(): string {
    return this.cep;
  }

  getCnpj(): string {
    return this.cnpj;
  }

  getUf(): string {
    return this.uf;
  }

  getCidade(): string {
    return this.cidade;
  }

  getEndereco(): string {
    return this.endereco;
  }

  getNumero(): number {
    return this.numero;
  }

  getBairro(): string {
    return this.bairro;
  }

  getTelefone(): string {
    return this.telefone;
  }

  getCelular(): string {
    return this.celular;
  }

  getCpf(): string {
    return this.cpf;
  }

  getEmail(): string {
    return this.email;
  }

  getCrefito(): string {
    return this.crefito;
  }

  getSexo(): number {
    return this.sexo;
  }

  getEstadoCivil(): number {
    return this.estadoCivil;
  }

  getAtivo(): number {
    return this.ativo;
  }
}
