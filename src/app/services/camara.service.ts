import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private alerta: AlertService) { }

  public takePicture1x1(){
    return new Promise<any>((resolve, reject) => {
      Camera.getPhoto({
        quality: 70,
        width: 200,
        height: 200,
        allowEditing: true,
        resultType: CameraResultType.Uri
      })
      .then(photo => {
        resolve(photo.webPath);
      })
      .catch(error => {
        this.alerta.presentAlert('Error al tomar foto: ', JSON.stringify(error.message));
      })
    })
    
  }

  public takePicture07x1(){
    return new Promise<any>((resolve, reject) => {
      Camera.getPhoto({
        quality: 70,
        width: 350,
        height: 500,
        allowEditing: false,
        resultType: CameraResultType.Uri
      })
      .then(photo => {
        resolve(photo.webPath);
      })
      .catch(error => {
        this.alerta.presentAlert('Error al tomar foto: ', JSON.stringify(error.message));
      })
    })
    
  }

  public takePictureFree(){
    return new Promise<any>((resolve, reject) => {
      Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri
      })
      .then(photo => {
        resolve(photo.webPath);
      })
      .catch(error => {
        this.alerta.presentAlert('Error al tomar foto: ', JSON.stringify(error.message));
      })
    })
    
  }
}
