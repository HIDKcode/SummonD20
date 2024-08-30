import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalaconfigPageRoutingModule } from './salaconfig-routing.module';

import { SalaconfigPage } from './salaconfig.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalaconfigPageRoutingModule
  ],
  declarations: [SalaconfigPage]
})
export class SalaconfigPageModule {}
