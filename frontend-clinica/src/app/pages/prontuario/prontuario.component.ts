import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prontuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prontuario.component.html',
  styleUrls: ['./prontuario.component.css']
})
export class ProntuarioComponent {

  cpfBusca = '';
  carregando = false;

  prontuario: any | null = null;
  erro = '';

  evolucaoSelecionada: any | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  buscarProntuario(): void {

    if (!this.cpfBusca) {
      this.erro = 'Informe o CPF';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.prontuario = null;
    this.evolucaoSelecionada = null;

    this.http.get<any>(
      `http://localhost:3000/api/prontuarios?cpf=${this.cpfBusca}`
    ).subscribe({
      next: res => {

        const normalizarData = (valor: any): Date | null => {
          if (!valor) return null;
          if (typeof valor === 'string' && valor.length === 10) {
            return new Date(valor + 'T12:00:00');
          }
          const d = new Date(valor);
          return isNaN(d.getTime()) ? null : d;
        };

        this.prontuario = {
          ...res,
          avaliacao: Array.isArray(res.avaliacao) && res.avaliacao.length
            ? {
                ...res.avaliacao[0],
                data: normalizarData(res.avaliacao[0].data)
              }
            : null,
          evolucoes: Array.isArray(res.evolucoes)
            ? res.evolucoes.map((e: any) => ({
                ...e,
                data: normalizarData(e.data)
              }))
            : []
        };

        this.carregando = false;

        // ✅ CORREÇÃO DEFINITIVA
        this.cdr.markForCheck();
      },
      error: err => {
        this.erro = err?.error?.message || 'Prontuário não encontrado';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  abrirHistorico(e: any): void {
    this.evolucaoSelecionada = e;
  }

  fecharHistorico(): void {
    this.evolucaoSelecionada = null;
  }
}