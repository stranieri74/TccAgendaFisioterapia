import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agenda-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-calendario.component.html',
  styleUrls: ['./agenda-calendario.component.css']
})
export class AgendaCalendarioComponent implements OnInit {

  // =============================
  // FILTROS
  // =============================
  funcionarios: any[] = [];
  profissionalId!: number;

  dataInicio!: string;

  // =============================
  // CALENDÁRIO
  // =============================
  diasSemana: Date[] = [];
  eventos: any[] = [];

  horas: string[] = [];

  horaAtual = '';
  linhaAtualIndex = -1;

  eventoSelecionado: any = null;

  @ViewChild('scrollArea') scrollArea!: ElementRef;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  // =============================
  // INIT
  // =============================
  ngOnInit(): void {

    this.dataInicio = this.getSegundaAtual();

    this.gerarHoras();
    this.gerarSemana(new Date(this.dataInicio));
    this.definirHoraAtual();
    this.carregarProfissionais();

    setTimeout(() => {
      this.scrollParaHoraAtual();
    }, 400);
  }

  diasSemanaPt = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

  // =============================
  // PROFISSIONAIS
  // =============================
  carregarProfissionais() {
    this.http
      .get<any[]>('http://localhost:3000/api/funcionarios')
      .subscribe(res => {
        this.funcionarios = res;
        this.cd.detectChanges();
      });
  }

  // =============================
  // BUSCAR AGENDA
  // =============================
  buscarAgenda() {

    if (!this.profissionalId || !this.dataInicio) return;

    this.http
      .get<any[]>(
        `http://localhost:3000/api/agendas?profissionalId=${this.profissionalId}&dataInicio=${this.dataInicio}`
      )
      .subscribe(res => {
        this.eventos = res;
        this.cd.detectChanges();
      });
  }

  // =============================
  // SEMANA
  // =============================
  gerarSemana(data: Date) {

    this.diasSemana = [];

    const inicio = new Date(data);
    inicio.setDate(inicio.getDate() - inicio.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      this.diasSemana.push(d);
    }
  }

  alterarSemana(offset: number) {

    const nova = new Date(this.dataInicio);
    nova.setDate(nova.getDate() + offset * 7);

    this.dataInicio = nova.toISOString().substring(0, 10);

    this.gerarSemana(nova);
    this.buscarAgenda();

    setTimeout(() => {
      this.scrollParaHoraAtual();
    }, 300);
  }

  // =============================
  // HORÁRIOS 15 EM 15
  // =============================
  gerarHoras() {

    const lista: string[] = [];

    for (let h = 5; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        lista.push(
          h.toString().padStart(2, '0') +
          ':' +
          m.toString().padStart(2, '0')
        );
      }
    }

    this.horas = lista;
  }

  // =============================
  // EVENTOS
  // =============================
  eventosPorDiaHora(dia: Date, hora: string) {
    return this.eventos.filter(e =>
      new Date(e.data).toDateString() === dia.toDateString() &&
      e.hora === hora
    );
  }

  getClasse(tipo: string) {
    if (tipo === 'FISIOTERAPIA') return 'fisio';
    if (tipo === 'AVALIACAO') return 'avaliacao';
    if (tipo === 'RETORNO') return 'retorno';
    return '';
  }

  // =============================
  // HORA ATUAL
  // =============================
  definirHoraAtual() {

    const agora = new Date();

    const h =
      agora.getHours().toString().padStart(2, '0');

    const m =
      Math.floor(agora.getMinutes() / 15) * 15;

    this.horaAtual = `${h}:${m.toString().padStart(2, '0')}`;

    this.linhaAtualIndex =
      this.horas.indexOf(this.horaAtual);
  }

  scrollParaHoraAtual() {

    if (!this.scrollArea || this.linhaAtualIndex < 0) return;

    const linha =
      this.scrollArea.nativeElement.querySelector(
        `.linha-${this.linhaAtualIndex}`
      );

    if (linha) {
      linha.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // =============================
  // MODAL
  // =============================
  abrirEvento(evento: any) {
    this.eventoSelecionado = evento;
  }

  fecharModal() {
    this.eventoSelecionado = null;
  }

  // =============================
  // UTIL
  // =============================
  getSegundaAtual(): string {

    const hoje = new Date();
    const dia = hoje.getDay();

    const diff =
      hoje.getDate() - dia + (dia === 0 ? -6 : 1);

    const segunda = new Date(hoje.setDate(diff));

    return segunda.toISOString().substring(0, 10);
  }

  isFimDeSemana(data: Date): boolean {
  const dia = data.getDay();
  return dia === 0 || dia === 6; // domingo ou sábado
}
}