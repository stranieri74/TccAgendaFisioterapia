import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.css'
})
export class PacienteFormComponent implements OnInit {

  sucesso = '';
  erro = '';
  carregando = false;
  editando = false;
  id!: number;

  paciente: any = {
    nome: '',
    dataNascimento: '',  
    cpf: '',
    sexo: '',
    estadoCivil: '',
    cep: '',
    estado: '',
    cidade: '',
    endereco: '',
    numero: 0,
    bairro: '',
    telefone: '',
    celular: '',
    email: '',
    convenio: ''
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
        this.buscarPaciente();
      } else {
        this.editando = false;
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.paciente = {
      nome: '',
      dataNascimento: '',
      cpf: '',
      sexo: '',
      estadoCivil: '',
      cep: '',
      estado: '',
      cidade: '',
      endereco: '',
      numero: 0,
      bairro: '',
      telefone: '',
      celular: '',
      email: '',
      convenio: ''
    };

    this.cd.detectChanges();
  }

  // BUSCAR PACIENTE
  buscarPaciente() {
    this.carregando = true;

    this.http
      .get<any>(`http://localhost:3000/api/pacientes?id=${this.id}`)
      .subscribe({
        next: res => {

          this.paciente = res;

          if (this.paciente.dataNascimento) {
            const data = new Date(this.paciente.dataNascimento);

            // evita problema de fuso horário
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');

            this.paciente.dataNascimento = `${ano}-${mes}-${dia}`;
          }

          this.carregando = false;
          this.cd.detectChanges();
        },

        error: () => {
          this.erro = 'Erro ao carregar paciente';
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

    const pacienteEnvio = {
      ...this.paciente,
      // backend pode receber Date ou string ISO
      dataNascimento: this.paciente.dataNascimento
        ? new Date(this.paciente.dataNascimento)
        : null
    };

    const request = this.editando
      ? this.http.put(
        'http://localhost:3000/api/pacientes',
        { ...pacienteEnvio, id: this.id }
      )
      : this.http.post(
        'http://localhost:3000/api/pacientes',
        pacienteEnvio
      );

    request.subscribe({
      next: () => {
        this.carregando = false;

        this.sucesso = this.editando
          ? 'Paciente atualizado com sucesso!'
          : 'Paciente cadastrado com sucesso!';

        setTimeout(() => {
          this.router.navigate(['/pacientes']);
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
          alert('Erro inesperado ao salvar paciente.');
        }

        this.cd.detectChanges();
      }
    });
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}