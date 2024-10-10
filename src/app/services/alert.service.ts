import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertcontroller: AlertController) { }

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertcontroller.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }
  
}
