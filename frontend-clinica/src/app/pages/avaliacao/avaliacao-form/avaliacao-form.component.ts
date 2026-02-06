import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-avaliacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avaliacao-form.component.html',
  styleUrls: ['./avaliacao-form.component.css']
})
export class AvaliacaoFormComponent implements OnInit {

  agendaId!: number;
  id?: number;
  editando = false;

  erro = '';
  sucesso = '';

  avaliacao: any = {
    queixa: '',
    historia: '',
    doencas: '',
    medicamentos: '',
    cirurgias: '',

    dor: '',
    inspecao: '',
    palpacao: '',
    adm: '',
    forca: '',
    testes: '',

    diagnostico: '',
    objetivos: '',
    plano: '',
    observacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const snapshot = this.route.snapshot;

    const agendaId = snapshot.paramMap.get('agendaId');
    const id = snapshot.paramMap.get('id');

    this.agendaId = Number(agendaId);
    this.id = id ? Number(id) : undefined;

    if (!this.agendaId || this.agendaId <= 0) {
      this.erro = 'Agenda não informada.';
      this.cdr.detectChanges();
      return;
    }

    // ✏️ edição
    if (this.id) {
      this.editando = true;
      this.buscar();
    }
  }

  // ===============================
  // 🔍 BUSCAR AVALIAÇÃO
  // ===============================
  buscar(): void {

    if (!this.agendaId) return;

    this.http
      .get<any>(
        `http://localhost:3000/api/avaliacao?agendaId=${this.agendaId}`
      )
      .subscribe({
        next: (res) => {
          this.avaliacao = res;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar avaliação.';
          this.cdr.detectChanges();
        }
      });
  }

  // ===============================
  // 💾 SALVAR
  // ===============================
  salvar(): void {

    this.erro = '';

    const payload = {
      agendaId: Number(this.agendaId),
      tipo: 'AVALIACAO',
      queixa: this.avaliacao.queixa || null,
      historia: this.avaliacao.historia || null,
      doencas: this.avaliacao.doencas || null,
      medicamentos: this.avaliacao.medicamentos || null,
      cirurgias: this.avaliacao.cirurgias || null,

      dor: this.avaliacao.dor !== ''
        ? Number(this.avaliacao.dor)
        : null,

      inspecao: this.avaliacao.inspecao || null,
      palpacao: this.avaliacao.palpacao || null,
      adm: this.avaliacao.adm || null,
      forca: this.avaliacao.forca || null,
      testes: this.avaliacao.testes || null,

      diagnostico: this.avaliacao.diagnostico || null,
      objetivos: this.avaliacao.objetivos || null,
      plano: this.avaliacao.plano || null,
      observacoes: this.avaliacao.observacoes || null
    };

    console.log(payload);
    const request = this.editando
      ? this.http.put(
        'http://localhost:3000/api/avaliacao',
        { ...payload, id: this.id }
      )
      : this.http.post(
        'http://localhost:3000/api/avaliacao',
        payload
      );

    request.subscribe({
      next: () => {
        this.router.navigate(['/avaliacoes']);
      },
      error: err => {
        this.erro =
          err?.error?.message ??
          'Erro ao salvar avaliação';

        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/avaliacoes']);
  }
}