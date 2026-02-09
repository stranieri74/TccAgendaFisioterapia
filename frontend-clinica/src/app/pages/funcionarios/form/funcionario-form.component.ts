import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent implements OnInit {

  sucesso = '';
  erro = '';
  carregando = false;
  editando = false;
  id!: number;

  funcionario: any = {
    nome: '',
    dataNascimento: '',
    cep: '',
    cnpj: '',
    uf: '',
    cidade: '',
    endereco: '',
    numero: 0,
    bairro: '',
    telefone: '',
    celular: '',
    cpf: '',
    email: '',
    crefito: '',
    sexo: 0,
    estadoCivil: 0,
    ativo: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.editando = true;
        this.id = Number(idParam);
        this.buscarFuncionario();
      } else {
        this.editando = false;
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.funcionario = {
      nome: '',
      dataNascimento: '',
      cep: '',
      cnpj: '',
      uf: '',
      cidade: '',
      endereco: '',
      numero: 0,
      bairro: '',
      telefone: '',
      celular: '',
      cpf: '',
      email: '',
      crefito: '',
      sexo: 0,
      estadoCivil: 0,
      ativo: 0
    };

    this.cd.detectChanges();
  }

  // BUSCAR Funcionario
  buscarFuncionario() {
    this.carregando = true;

    this.http
      .get<any>(`http://localhost:3000/api/funcionarios?id=${this.id}`)
      .subscribe({
        next: res => {

          this.funcionario = res;

          if (this.funcionario.dataNascimento) {
            const data = new Date(this.funcionario.dataNascimento);

            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');

            this.funcionario.dataNascimento = `${ano}-${mes}-${dia}`;
          }

          this.carregando = false;
          this.cd.detectChanges();
        },

        error: () => {
          this.erro = 'Erro ao carregar funcionario';
          this.carregando = false;
          this.cd.detectChanges();
        }
      });
  }

  // SALVAR
  salvar() {

    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    const funcionarioEnvio = {
      ...this.funcionario,
      // backend pode receber Date ou string ISO
      dataNascimento: this.funcionario.dataNascimento
        ? new Date(this.funcionario.dataNascimento)
        : null
    };

    const request = this.editando
      ? this.http.put(
        'http://localhost:3000/api/funcionarios',
        { ...funcionarioEnvio, id: this.id }
      )
      : this.http.post(
        'http://localhost:3000/api/funcionarios',
        funcionarioEnvio
      );

    request.subscribe({
      next: () => {
        this.carregando = false;

        this.sucesso = this.editando
          ? 'Funcionário atualizado com sucesso!'
          : 'Funcionário cadastrado com sucesso!';

        setTimeout(() => {
          this.router.navigate(['/funcionarios']);
        }, 1000);
      },

      error: (err: HttpErrorResponse) => {
        this.carregando = false;

        if (err.error?.message) {

          if (typeof err.error.message === 'string') {
            alert(err.error.message);

          } else if (Array.isArray(err.error.message)) {
            alert(err.error.message.join(' | '));
          }

        } else if (err.error?.error) {
          alert(err.error.error);
        } else {
          alert('Erro inesperado ao salvar funcionários.');
        }

        this.cd.detectChanges();
      }
    });
  }

  cancelar() {
    this.router.navigate(['/funcionarios']);
  }
}