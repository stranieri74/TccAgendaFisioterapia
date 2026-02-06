import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-evolucao-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evolucao-list.component.html',
  styleUrls: ['./evolucao-list.component.css']
})
export class EvolucaoListComponent implements OnInit {

  sessoes: any[] = [];
  profissionalId!: number;

  carregando = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const id = this.authService.getProfissionalId();

    if (!id) {
      this.erro = 'Profissional não identificado';
      return;
    }

    this.profissionalId = id;
    this.buscar();
  }

  buscar(): void {

    this.carregando = true;

    this.http.get<any[]>(
      `http://localhost:3000/api/evolucao?hoje=true&profissionalId=${this.profissionalId}`
    )
      .subscribe({
        next: (res) => {
          this.sessoes = res ?? [];
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar evoluções';
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
  }

  evoluir(agendaDiaId: number, evolucaoId?: number): void {
    if (evolucaoId) {
      this.router.navigate(['/evolucao', agendaDiaId, evolucaoId]);
    } else {
      this.router.navigate(['/evolucao', agendaDiaId]);
    }
  }
}