import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  carregando = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregando = true;
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.carregando = true;

    this.http.get<any[]>('http://localhost:3000/api/usuarios')
      .subscribe({
        next: (res) => {
          this.usuarios = res;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar usuarios';
          this.carregando = false;
        }
      });
  }

  excluir(id: number) {
    if (!confirm('Deseja realmente excluir este usuarios?')) return;

    this.http.delete(
      `http://localhost:3000/api/usuarios?id=${id}`
    ).subscribe(() => {
      this.listarUsuarios();
    });
  }

  novo() {
    this.router.navigate(['/usuarios/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/usuarios/editar', id]);
  }
}