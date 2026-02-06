import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.css'
})
export class FuncionariosComponent implements OnInit {

  funcionarios: any[] = [];
  carregando = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregando = true;
    this.listarFuncionarios();
  }

  listarFuncionarios() {
    this.carregando = true;

    this.http.get<any[]>('http://localhost:3000/api/funcionarios')
      .subscribe({
        next: (res) => {
          this.funcionarios = res;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar funcionarios';
          this.carregando = false;
        }
      });
  }

  excluir(id: number) {
    if (!confirm('Deseja realmente excluir este funcionarios?')) return;

    this.http.delete(
      `http://localhost:3000/api/funcionarios?id=${id}`
    ).subscribe(() => {
      this.listarFuncionarios();
    });
  }

  novo() {
    this.router.navigate(['/funcionarios/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/funcionarios/editar', id]);
  }
}