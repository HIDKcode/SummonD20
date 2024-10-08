import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalacreatePage } from './salacreate.page';

const routes: Routes = [
  {
    path: '',
    component: SalacreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalacreatePageRoutingModule {}
