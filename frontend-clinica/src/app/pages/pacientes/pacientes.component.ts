import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {

  pacientes: any[] = [];
  carregando = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
     this.carregando = true;
    this.listarPacientes();
  }

  listarPacientes() {
    this.carregando = true;

    this.http.get<any[]>('http://localhost:3000/api/pacientes')
      .subscribe({
        next: (res) => {
          this.pacientes = res;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar pacientes';
          this.carregando = false;
        }
      });
  }

  excluir(id: number) {
    if (!confirm('Deseja realmente excluir este paciente?')) return;

    this.http.delete(
      `http://localhost:3000/api/pacientes?id=${id}`
    ).subscribe(() => {
      this.listarPacientes();
    });
  }

  novo() {
    this.router.navigate(['/pacientes/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/pacientes/editar', id]);
  }
}