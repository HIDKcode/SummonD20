import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalachatPage } from './salachat.page';

const routes: Routes = [
  {
    path: '',
    component: SalachatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalachatPageRoutingModule {}
