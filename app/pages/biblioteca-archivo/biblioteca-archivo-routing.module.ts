import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BibliotecaArchivoPage } from './biblioteca-archivo.page';

const routes: Routes = [
  {
    path: '',
    component: BibliotecaArchivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliotecaArchivoPageRoutingModule {}
