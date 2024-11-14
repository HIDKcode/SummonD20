import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalalistasPage } from './salalistas.page';

const routes: Routes = [
  {
    path: '',
    component: SalalistasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalalistasPageRoutingModule {}
