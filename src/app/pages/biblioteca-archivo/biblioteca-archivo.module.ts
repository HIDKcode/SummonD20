import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BibliotecaArchivoPageRoutingModule } from './biblioteca-archivo-routing.module';

import { BibliotecaArchivoPage } from './biblioteca-archivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BibliotecaArchivoPageRoutingModule
  ],
  declarations: [BibliotecaArchivoPage]
})
export class BibliotecaArchivoPageModule {}
