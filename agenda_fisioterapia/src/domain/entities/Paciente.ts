export class Paciente {
   private id: number;
   private nome: string;
   private dataNascimento: Date;
   private cep: string;
   private uf: string;
   private cidade: string;
   private endereco: string;
   private numero: number;
   private bairro: string;
   private telefone: string;
   private celular: string;
   private cpf: string;
   private email: string;
   private convenio: string;
   private sexo: number;
   private estadoCivil: number;

   constructor(id: number,
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
               estadoCivil: number){
            this.id = id;
            this.nome = nome;
            this.dataNascimento = dataNascimento;
            this.cep = cep;
            this.uf = uf;
            this.endereco = endereco;
            this.numero = numero;
            this.bairro = bairro;
            this.telefone = telefone;
            this.celular = celular;
            this.cpf = cpf;
            this.email = email;
            this.convenio = convenio;
            this.sexo = sexo;
            this.estadoCivil = estadoCivil;
            this.cidade = cidade;

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

   getUf(): string {
      return this.uf;
    }

   getEndereco(): string {
      return this.endereco;
    }

   getNumero() {
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

   getConvenio(): string {
      return this.convenio;
    }  
    
   getSexo(): number {
       return this.sexo;
    }

   getEstadoCivil(): number {
       return this.estadoCivil;
    }

   getCidade(): string {
      return this.cidade;
    }  

}