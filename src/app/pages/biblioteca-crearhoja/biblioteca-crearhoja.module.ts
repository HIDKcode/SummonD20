import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BibliotecaCrearhojaPageRoutingModule } from './biblioteca-crearhoja-routing.module';

import { BibliotecaCrearhojaPage } from './biblioteca-crearhoja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BibliotecaCrearhojaPageRoutingModule
  ],
  declarations: [BibliotecaCrearhojaPage]
})
export class BibliotecaCrearhojaPageModule {}
