import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-avaliacao-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avaliacao-list.component.html',
  styleUrls: ['./avaliacao-list.component.css']
})
export class AvaliacaoListComponent implements OnInit {

  atendimentos: any[] = [];
  profissionalId!: number;

  carregando = false;
  erro = '';
  sucesso = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const id = this.authService.getProfissionalId();

    if (!id || id <= 0) {
      this.erro = 'Profissional não identificado.';
      return;
    }

    this.profissionalId = id;
    this.buscarAtendimentos();
  }

  // ===============================
  // 🔍 BUSCAR AVALIAÇÕES DO DIA
  // ===============================
  buscarAtendimentos(): void {

    this.carregando = true;
    this.erro = '';

    this.http.get<any[]>(
      `http://localhost:3000/api/agendas?profissionalId=${this.profissionalId}&avaliacaoHoje=true`
    ).subscribe({

      next: (res) => {

        this.atendimentos = (res ?? []).map(a => {

          const statusAgenda = a.AgendaDia?.[0]?.status;
          const temAvaliacao = !!a.avaliacaoId;

          let statusAvaliacao = 'PENDENTE';

          if (statusAgenda === 'REALIZADO' && !temAvaliacao) {
            statusAvaliacao = 'REALIZADO';
          }

          if (statusAgenda === 'REALIZADO' && temAvaliacao) {
            statusAvaliacao = 'CONCLUIDO';
          }

          return {
            ...a,
            statusAvaliacao
          };
        });

        this.carregando = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.erro = 'Erro ao carregar atendimentos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ===============================
  // 📝 AVALIAR / EDITAR
  // ===============================
  avaliar(agendaId: number, avaliacaoId?: number): void {

    if (!agendaId || agendaId <= 0) {
      this.erro = 'Agenda inválida.';
      return;
    }

    // ✏️ edição direta
    if (avaliacaoId) {
      this.router.navigate([
        '/avaliacoes',
        agendaId,
        avaliacaoId
      ]);
      return;
    }

    // ➕ nova avaliação
    this.router.navigate(['/avaliacoes', agendaId]);
  }
}