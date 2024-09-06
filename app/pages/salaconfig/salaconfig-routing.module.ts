import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalaconfigPage } from './salaconfig.page';

const routes: Routes = [
  {
    path: '',
    component: SalaconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaconfigPageRoutingModule {}
