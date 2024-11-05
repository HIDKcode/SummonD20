import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigclavePageRoutingModule } from './configclave-routing.module';

import { ConfigclavePage } from './configclave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigclavePageRoutingModule
  ],
  declarations: [ConfigclavePage]
})
export class ConfigclavePageModule {}
