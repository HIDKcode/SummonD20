import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalachatPageRoutingModule } from './salachat-routing.module';

import { SalachatPage } from './salachat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalachatPageRoutingModule
  ],
  declarations: [SalachatPage]
})
export class SalachatPageModule {}
