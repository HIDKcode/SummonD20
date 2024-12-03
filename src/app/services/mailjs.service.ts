import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MailjsService {

  private serviceID = 'service_ProgWeb_Proy2024';
  private templateID = 'template_9j9lpus'; 
  private emailjskey = 'XGSRyFVpmsTq_nYzy';

  constructor(private alerta: AlertService){ }

  async enviarCorreo(nombre: string, correo: string, codigo: string) {

    const templateParams = {
      user_nick: nombre,
      user_email: correo,
      codigo: codigo,
    };

    try {
      const response = await emailjs.send(
        this.serviceID,
        this.templateID,
        templateParams,
        this.emailjskey 
      );
    } catch (e: any) {
      this.alerta.presentAlert('Error en envio de mensaje','Contacte soporte');
    }
  }

}
