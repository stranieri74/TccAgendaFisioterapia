import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css']
})
export class AgendaFormComponent implements OnInit {

  // CONTROLE
  modo: 'FISIOTERAPIA' | 'AVALIACAO' | 'RETORNO' = 'AVALIACAO';
  editando = false;
  id!: number;

  erro = '';
  sucesso = '';

  // COMBOS
  pacientes: any[] = [];
  funcionarios: any[] = [];

  // FORM
  agendamento: any = {
    pacienteId: '',
    profissionalId: '',
    tipo: 'AVALIACAO',
    dataInicio: '',
    hora: '',
    quantidade: 1
  };

  // FISIOTERAPIA
  diasSemana = [
    { label: 'Domingo', valor: 0 },
    { label: 'Segunda', valor: 1 },
    { label: 'Terça', valor: 2 },
    { label: 'Quarta', valor: 3 },
    { label: 'Quinta', valor: 4 },
    { label: 'Sexta', valor: 5 },
    { label: 'Sábado', valor: 6 }
  ];

  diasSelecionados: number[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const tipo = this.route.snapshot.paramMap.get('tipo');

    if (tipo === 'FISIOTERAPIA') {
      this.modo = 'FISIOTERAPIA';
      this.agendamento.tipo = 'FISIOTERAPIA';
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.carregarCombos();
    if (id) {
      this.editando = true;
      this.id = Number(id);
      this.buscar();
    }

    
  }

  // COMBOS
  carregarCombos(): void {

    this.http.get<any[]>('http://localhost:3000/api/pacientes')
      .subscribe(res => this.pacientes = res);

    this.http.get<any[]>('http://localhost:3000/api/funcionarios')
      .subscribe(res => this.funcionarios = res);
  }

  // BUSCAR
  buscar(): void {

    this.http
      .get<any>(`http://localhost:3000/api/agendas?id=${this.id}`)
      .subscribe(res => {

        this.agendamento = {
          pacienteId: res.pacienteId,
          profissionalId: res.profissionalId,
          tipo: res.tipo,
          dataInicio: res.dataInicio?.substring(0, 10),
          hora: res.AgendaDia?.[0]?.hora ?? '',
          quantidade: res.AgendaDia?.length ?? 1
        };

        this.modo = res.tipo;

        if (res.tipo === 'FISIOTERAPIA' && res.AgendaDia?.length) {
          this.diasSelecionados = Array.from(
            new Set(
              res.AgendaDia.map((d: any) => new Date(d.data).getDay())
            )
          );
        }

        this.cd.detectChanges();
      });
  }

  // DIAS
  toggleDia(dia: number): void {
    this.diasSelecionados.includes(dia)
      ? this.diasSelecionados =
          this.diasSelecionados.filter(d => d !== dia)
      : this.diasSelecionados.push(dia);
  }

  // SALVAR
  salvar(): void {

    this.erro = '';

    const payload: any = {
      pacienteId: Number(this.agendamento.pacienteId),
      profissionalId: Number(this.agendamento.profissionalId),
      usuarioId: 1, // ajuste se necessário
      tipo: this.modo,
      dataInicio: this.agendamento.dataInicio,
      hora: this.agendamento.hora
    };

    // FISIOTERAPIA
    if (this.modo === 'FISIOTERAPIA') {

      if (
        !this.diasSelecionados.length ||
        !this.agendamento.hora ||
        !this.agendamento.quantidade
      ) {
        this.erro = 'Informe dias, horário e quantidade';
        return;
      }

      payload.diasSemana = this.diasSelecionados.map(d => Number(d));
      payload.quantidade = Number(this.agendamento.quantidade);
    }

    const req = this.editando
      ? this.http.put(
          'http://localhost:3000/api/agendas',
          { ...payload, id: Number(this.id) }
        )
      : this.http.post(
          'http://localhost:3000/api/agendas',
          payload
        );

    req.subscribe({
      next: () => this.router.navigate(['/agenda']),
      error: err =>
        this.erro =
          err?.error?.message ??
          'Erro ao salvar agendamento'
    });
  }

  cancelar(): void {
    this.router.navigate(['/agenda']);
  }
}