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

export const routes: Routes = [

  // 🔓 login fora do layout
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
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
      }

    ]
  }

];