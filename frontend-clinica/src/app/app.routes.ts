import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PerfilGuard } from './core/guards/perfil.guard';
import { PerfilUsuario } from './core/guards/perfil-usuario.enum';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { PacienteFormComponent } from './pages/pacientes/form/paciente-form.component';

import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { FuncionarioFormComponent } from './pages/funcionarios/form/funcionario-form.component';

import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuarioFormComponent } from './pages/usuarios/form/usuario-form.component';

import { AgendaListComponent } from './pages/agenda/agenda-list.component';
import { AgendaFormComponent } from './pages/agenda/agenda-form/agenda-form.component';
import { AgendaCalendarioComponent } from './pages/agenda/calendario/agenda-calendario.component';

import { SobreComponent } from './pages/sobre/sobre.component';

import { AvaliacaoListComponent } from './pages/avaliacao/avaliacao-list.component';
import { AvaliacaoFormComponent } from './pages/avaliacao/avaliacao-form/avaliacao-form.component';

import { EvolucaoListComponent } from './pages/evolucao/evolucao-list.component';
import { EvolucaoFormComponent } from './pages/evolucao/evolucao-form/evolucao-form.component';

import { ProntuarioComponent } from './pages/prontuario/prontuario.component';

export const routes: Routes = [

  // 🔓 rotas públicas
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () =>
      import('./pages/esqueciSenha/redefinir-senha.component')
        .then(m => m.RedefinirSenhaComponent)
  },

  // 🔐 rotas protegidas
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      // =========================
      // PACIENTES (logado)
      // =========================
      {
        path: 'pacientes',
        component: PacientesComponent
      },
      {
        path: 'pacientes/novo',
        component: PacienteFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pacientes/editar/:id',
        component: PacienteFormComponent,
        runGuardsAndResolvers: 'always'
      },

      // =========================
      // FUNCIONÁRIOS (ADMIN)
      // =========================
      {
        path: 'funcionarios',
        component: FuncionariosComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        }
      },
      {
        path: 'funcionarios/novo',
        component: FuncionarioFormComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'funcionarios/editar/:id',
        component: FuncionarioFormComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        },
        runGuardsAndResolvers: 'always'
      },

      // =========================
      // USUÁRIOS (ADMIN)
      // =========================
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        }
      },
      {
        path: 'usuarios/novo',
        component: UsuarioFormComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'usuarios/editar/:id',
        component: UsuarioFormComponent,
        canActivate: [PerfilGuard],
        data: {
          perfis: [PerfilUsuario.ADMIN]
        },
        runGuardsAndResolvers: 'always'
      },

      // =========================
      // AGENDA (logado)
      // =========================
      {
        path: 'agenda',
        component: AgendaListComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'agenda/novo',
        component: AgendaFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'agenda/editar/:id',
        component: AgendaFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'calendario',
        component: AgendaCalendarioComponent,
        runGuardsAndResolvers: 'always'
      },

      // =========================
      // OUTROS
      // =========================
      {
        path: 'sobre',
        component: SobreComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'avaliacoes',
        component: AvaliacaoListComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'avaliacoes/:agendaId',
        component: AvaliacaoFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'avaliacoes/:agendaId/:id',
        component: AvaliacaoFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'evolucao',
        component: EvolucaoListComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'evolucao/:agendaDiaId',
        component: EvolucaoFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'evolucao/:agendaDiaId/:id',
        component: EvolucaoFormComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'prontuario',
        component: ProntuarioComponent,
        runGuardsAndResolvers: 'always'
        
      }
    ]
  }
];