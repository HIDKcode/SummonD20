import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private alerta: AlertService) { }

  public takePicture(){
    return new Promise<any>((resolve, reject) => {
      Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Uri
      })
      .then(photo => {
        resolve(photo.webPath);
      })
      .catch(error => {
        this.alerta.presentAlert('Error al tomar foto: ', JSON.stringify(error));
      })
    })
    
  }

}
