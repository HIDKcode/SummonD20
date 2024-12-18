import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'sala/:grupoID',
    loadChildren: () => import('./pages/sala/sala.module').then( m => m.SalaPageModule)
  },
  {
    path: 'biblioteca',
    loadChildren: () => import('./pages/biblioteca/biblioteca.module').then( m => m.BibliotecaPageModule)
  },
  {
    path: 'salalistas',
    loadChildren: () => import('./pages/salalistas/salalistas.module').then( m => m.SalalistasPageModule)
  },
  {
    path: 'salacreate',
    loadChildren: () => import('./pages/salacreate/salacreate.module').then( m => m.SalacreatePageModule)
  },
  {
    path: 'biblioteca-archivo',
    loadChildren: () => import('./pages/biblioteca-archivo/biblioteca-archivo.module').then( m => m.BibliotecaArchivoPageModule)
  },
  {
    path: 'biblioteca-crearhoja',
    loadChildren: () => import('./pages/biblioteca-crearhoja/biblioteca-crearhoja.module').then( m => m.BibliotecaCrearhojaPageModule)
  },
  {
    path: 'rolldice',
    loadChildren: () => import('./pages/rolldice/rolldice.module').then( m => m.RolldicePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'configclave',
    loadChildren: () => import('./pages/configclave/configclave.module').then( m => m.ConfigclavePageModule)
  },
  {
    path: 'recuperarclave',
    loadChildren: () => import('./pages/recuperarclave/recuperarclave.module').then( m => m.RecuperarclavePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
