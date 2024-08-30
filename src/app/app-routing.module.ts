import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
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
    path: 'sala',
    loadChildren: () => import('./pages/sala/sala.module').then( m => m.SalaPageModule)
  },
  {
    path: 'biblioteca',
    loadChildren: () => import('./pages/biblioteca/biblioteca.module').then( m => m.BibliotecaPageModule)
  },
  {
    path: 'salaconfig',
    loadChildren: () => import('./pages/salaconfig/salaconfig.module').then( m => m.SalaconfigPageModule)
  },
  {
    path: 'salachat',
    loadChildren: () => import('./pages/salachat/salachat.module').then( m => m.SalachatPageModule)
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
    path: 'notfound',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
