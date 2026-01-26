import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.css'
})
export class AgendaListComponent implements OnInit {

  agendamentos: any[] = [];
  carregando = false;
  erro = '';

  // 🔥 backend novo
  apiUrl = 'http://localhost:3000/api/agendas';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarAgendamentos();
  }

  // LISTAR TODAS AS AGENDAS
  listarAgendamentos() {
  this.carregando = true;

  this.http.get<any[]>('http://localhost:3000/api/agendas')
    .subscribe({
      next: (res) => {

        this.agendamentos = res.map(a => ({
          ...a,
          hora: a.AgendaDia?.length
            ? a.AgendaDia[0].hora
            : '',
          data: a.AgendaDia?.length
            ? a.AgendaDia[0].data
            : ''
        }));

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar agendamentos';
        this.carregando = false;
      }
    });
}

  // EXCLUIR
  excluir(id: number) {

    if (!confirm('Deseja realmente excluir este agendamento?')) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}?id=${id}`
    ).subscribe({
      next: () => {
        this.listarAgendamentos();
      },
      error: (err) => {
        alert(err?.error?.message || 'Erro ao excluir');
      }
    });
  }

  // NAVEGAÇÃO
  novo() {
    this.router.navigate(['/agenda/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/agenda/editar', id]);
  }

  // CLASSE DE COR
  getClasseEvento(tipo: string): string {

  if (tipo === 'FISIOTERAPIA') {
    return 'linha-fisio';
  }

  if (tipo === 'AVALIACAO') {
    return 'linha-avaliacao';
  }

  if (tipo === 'RETORNO') {
    return 'linha-retorno';
  }

  if (tipo === 'FALTA') {
    return 'falta';
  }

  if (tipo === 'REALIZADO') {
    return 'realizado';
  }

  if (tipo === 'REMARCADO') {
    return 'remarcado';
  }
  if (tipo === 'CANCELADO') {
    return 'cancelado';
  }

  return '';
}
}
