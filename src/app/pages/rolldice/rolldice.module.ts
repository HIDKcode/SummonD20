import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolldicePageRoutingModule } from './rolldice-routing.module';

import { RolldicePage } from './rolldice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolldicePageRoutingModule
  ],
  declarations: [RolldicePage]
})
export class RolldicePageModule {}
