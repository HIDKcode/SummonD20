import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BibliotecaCrearhojaPage } from './biblioteca-crearhoja.page';

const routes: Routes = [
  {
    path: '',
    component: BibliotecaCrearhojaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliotecaCrearhojaPageRoutingModule {}
