import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/clasesdb';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  
  //variables
  exprMail = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  //errores
  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef
  @ViewChild('error3', {static: true}) er3!: ElementRef
  @ViewChild('error4', {static: true}) er4!: ElementRef
  

  VuserID: any;
  Vnick: any;
  Vcorreo: any;
  Vpass: any;
  Vpass2: any;
  Vprofile!: any;
  activo: any;
  Vclave: any;

  variable: boolean = false;
  Vprivado: string = "";

  constructor(private router: Router, private activatedroute: ActivatedRoute, 
    private alerta: AlertService ,private renderer2: Renderer2, 
    private datab: DatabaseService, private nativeStorage: NativeStorage,
    private menuCtrl: MenuController) {
      this.menuCtrl.enable(true);
      this.cargaNick().then(() => {
        this.getUserData();
      });
  }

  ngOnInit(){
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      if (image && image.webPath) {
        this.Vprofile = image.webPath;
      }
    } catch (error) {
      this.alerta.presentAlert("Error", "No se pudo capturar la imagen," + error);
    }
  }

  Actualiza(){
      
      // While loop con variable boolean
      while(this.variable == false){
        // inicia If para errores
        let hasE = false;

      // Valida usuario
      if (this.Vnick == "" || this.Vnick.length <= 5) {
        this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
        hasE = true;
      } else {
        this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
      }

      // Valida email
      if (this.Vcorreo == "" || !this.exprMail.test(this.Vcorreo)) {
        this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
        hasE = true;
      } else {
        this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
      }

      // Si hay algún error, parará aquí.
      if (hasE) {
        return false;
      }
        this.variable = true;
      }
      // Funcion con data base aquí 
        return true;
    }

  

  getUserData() {
    this.datab.fetchUser(this.Vnick).subscribe({
      next: (userData: User[]) => {
        if (userData.length > 0) {
          // Procesar datos del usuario
          this.VuserID = userData[0].userID;
          this.Vnick = userData[0].nick;
          this.Vclave = userData[0].clave;
          this.Vcorreo = userData[0].correo;
          this.Vprofile = userData[0].perfil_media;
          this.activo = userData[0].activo;
        } else {
          this.alerta.presentAlert("Usuario no encontrado", "");
        }
      },
      error: (e) => {
        const em = e.message;
        this.alerta.presentAlert("Fallo en carga de datos", "Error: " + em);
      }
    });
  }
  
  async cargaNick(){
    try {
        const userData = await this.nativeStorage.getItem('userData');
        this.Vnick = userData.nick;
        return true;
    } catch (error) {
        console.error("Error Native Storage:", error);
        return null;
    }
  }
  
}
