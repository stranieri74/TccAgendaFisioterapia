import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evolucao-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evolucao-form.component.html',
  styleUrls: ['./evolucao-form.component.css']
})
export class EvolucaoFormComponent implements OnInit {

  agendaDiaId!: number;
  id?: number;

  editando = false;
  erro = '';

  evolucao: any = {
    conduta: '',
    exercicios: '',
    recursos: '',
    respostaPaciente: '',
    observacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const agendaDiaId = this.route.snapshot.paramMap.get('agendaDiaId');
    const id = this.route.snapshot.paramMap.get('id');

    this.agendaDiaId = Number(agendaDiaId);
    this.id = id ? Number(id) : undefined;

    if (!this.agendaDiaId) {
      this.erro = 'Sessão não informada';
      return;
    }

    if (this.id) {
      this.editando = true;
      this.buscar();
    }
  }

buscar(): void {

  this.http.get<any>(
    `http://localhost:3000/api/evolucao?Id=${this.id}`
  )
  .subscribe({
    next: (res) => {

      this.evolucao = {
        ...res,

        // ✅ conversão correta Decimal → boolean
        alta: res.alta === 1 || res.alta === '1'
      };

      this.cdr.detectChanges();
    },

    error: () => {
      this.erro = 'Erro ao carregar evolução';
    }
  });
}

  salvar(): void {

    const payload = {
      agendaDiaId: this.agendaDiaId,
      ...this.evolucao
    };

    const req = this.editando
      ? this.http.put('http://localhost:3000/api/evolucao', {
          ...payload,
          id: this.id
        })
      : this.http.post('http://localhost:3000/api/evolucao', payload);

    req.subscribe({
      next: () => this.router.navigate(['/evolucao']),
      error: err =>
        this.erro =
          err?.error?.message ||
          'Erro ao salvar evolução'
    });
  }

  cancelar(): void {
    this.router.navigate(['/evolucao']);
  }
}