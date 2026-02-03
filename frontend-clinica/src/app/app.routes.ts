import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
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
import { RedefinirSenhaComponent } from './pages/esqueciSenha/redefinir-senha.component';
export const routes: Routes = [

  // 🔓 login fora do layout
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
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // 📋 lista
      {
        path: 'pacientes',
        component: PacientesComponent
      },

      // ➕ novo paciente
      {
        path: 'pacientes/novo',
        component: PacienteFormComponent,
        runGuardsAndResolvers: 'always'
      },

      // ✏ editar paciente
      {
        path: 'pacientes/editar/:id',
        component: PacienteFormComponent,
        runGuardsAndResolvers: 'always'
      },
      // 📋 lista
      {
        path: 'funcionarios',
        component: FuncionariosComponent
      },

      // ➕ novo funcionarios
      {
        path: 'funcionarios/novo',
        component: FuncionarioFormComponent,
        runGuardsAndResolvers: 'always'
      },

      // ✏ editar funcionarios
      {
        path: 'funcionarios/editar/:id',
        component: FuncionarioFormComponent,
        runGuardsAndResolvers: 'always'
      },
      // 📋 lista
      {
        path: 'usuarios',
        component: UsuariosComponent
      },

      // ➕ novo funcionarios
      {
        path: 'usuarios/novo',
        component: UsuarioFormComponent,
        runGuardsAndResolvers: 'always'
      },

      // ✏ editar funcionarios
      {
        path: 'usuarios/editar/:id',
        component: UsuarioFormComponent,
        runGuardsAndResolvers: 'always'
      },
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
      {
        path: 'sobre',
        component: SobreComponent,
        runGuardsAndResolvers: 'always'
      },      
     {
      path: 'avaliacoes/:agendaId/:id',
      component: AvaliacaoFormComponent,
      runGuardsAndResolvers: 'always'
     },
     {
      path: 'avaliacoes/:agendaId',
      component: AvaliacaoFormComponent,
      runGuardsAndResolvers: 'always'
    },
    {
       path: 'avaliacoes',
       component: AvaliacaoListComponent,
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
    }

    ]
  }

];