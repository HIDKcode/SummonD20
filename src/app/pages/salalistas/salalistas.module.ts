import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalalistasPageRoutingModule } from './salalistas-routing.module';

import { SalalistasPage } from './salalistas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalalistasPageRoutingModule
  ],
  declarations: [SalalistasPage]
})
export class SalalistasPageModule {}
