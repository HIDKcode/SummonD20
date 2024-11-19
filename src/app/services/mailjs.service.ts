import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MailjsService {

  private serviceID = 'service_ProgWeb_Proy2024';
  private templateID = 'template_9j9lpus'; 
  private userID = 'XGSRyFVpmsTq_nYzy';

  constructor(private alerta: AlertService){ }

  async enviarCorreo(nombre: string, correo: string, clave: string) {

    const templateParams = {
      user_nick: nombre,
      user_password: clave,
      user_email: correo,
    };

    try {
      const response = await emailjs.send(
        this.serviceID,
        this.templateID,
        templateParams,
        this.userID // Esto es opcional si ya configuraste una clave pública en EmailJS
      );
    } catch (e: any) {
      this.alerta.presentAlert('Error','Contacte soporte:' + e.message);
    }
  }

}
