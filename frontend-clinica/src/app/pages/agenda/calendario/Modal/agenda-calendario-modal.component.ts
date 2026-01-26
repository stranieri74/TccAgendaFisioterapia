import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agenda-calendario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-calendario-modal.component.html',
  styleUrls: ['./agenda-calendario-modal.component.css']
})
export class AgendaCalendarioModalComponent {

  @Input() sessao: any;

  @Output() fechar = new EventEmitter<void>();

  @Output() reagendar =
    new EventEmitter<{ id: number; novaData: string; novaHora: string }>();

  @Output() cancelar =
    new EventEmitter<number>();

  @Output() excluir =
    new EventEmitter<number>();

  @Output() alterarStatus =
    new EventEmitter<{ id: number; status: string }>();

  novaData = '';
  novaHora = '';

  // =============================
  fecharModal() {
    this.fechar.emit();
  }

  // =============================
  confirmarReagendamento() {
    this.reagendar.emit({
      id: this.sessao.id,
      novaData: this.novaData,
      novaHora: this.novaHora
    });
  }

  // =============================
  cancelarSessao() {
    this.cancelar.emit(this.sessao.id);
  }

  // =============================
  excluirSessao() {
    this.excluir.emit(this.sessao.id);
  }

  // =============================
  marcarFalta() {
    this.alterarStatus.emit({
      id: this.sessao.id,
      status: 'FALTA'
    });
  }

  // =============================
  marcarRealizado() {
    this.alterarStatus.emit({
      id: this.sessao.id,
      status: 'REALIZADO'
    });
  }

  // =============================
  marcarAgendado() {
    this.alterarStatus.emit({
      id: this.sessao.id,
      status: 'AGENDADO'
    });
  }
}