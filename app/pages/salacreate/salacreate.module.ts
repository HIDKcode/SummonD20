import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalacreatePageRoutingModule } from './salacreate-routing.module';

import { SalacreatePage } from './salacreate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalacreatePageRoutingModule
  ],
  declarations: [SalacreatePage]
})
export class SalacreatePageModule {}
