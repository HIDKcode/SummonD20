import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolldicePage } from './rolldice.page';

const routes: Routes = [
  {
    path: '',
    component: RolldicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolldicePageRoutingModule {}
