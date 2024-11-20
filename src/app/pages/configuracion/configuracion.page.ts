import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/clasesdb';
import { CamaraService } from 'src/app/services/camara.service';

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
  
  isReadonly = false;
  VuserID: any;
  Vnick: any;
  Vcorreo: any;
  Vpass: any;
  Vpass2: any;
  Vprofile!: any;
  estado: any;
  Vclave: any;

  variable: boolean = false;
  Vprivado: string = "";

  constructor(private router: Router, private activatedroute: ActivatedRoute, 
    private alerta: AlertService ,private renderer2: Renderer2, 
    private datab: DatabaseService, private nativeStorage: NativeStorage,
    private menuCtrl: MenuController, private camaraservicio: CamaraService) {
      this.menuCtrl.enable(true);
      this.cargaNick().then(() => {
        this.getUserData();
      });
  }

  ngOnInit(){
  }

  irCambioclave(){

  }
  
  foto(){
    this.camaraservicio.takePicture()
    .then((img) => {
      this.Vprofile = img;
      this.datab.modificafoto(this.Vprofile, this.Vnick);
    }) 

  }

  Actualiza(){
      let hasE = false;
      if (this.Vcorreo == "" || !this.exprMail.test(this.Vcorreo)) {
        this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
        hasE = true;
      } else {
        this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
      }
      if (hasE) {
        return false;
      }
      this.datab.modificaCorreo(this.Vnick, this.Vcorreo);
      return;
    }

  getUserData(){
    this.datab.fetchUsuario(this.Vnick).subscribe({
      next: (userData: User[]) => {
        if (userData.length > 0) {
          // Procesar datos del usuario
          this.VuserID = userData[0].userID;
          this.Vnick = userData[0].nick;
          this.Vcorreo = userData[0].correo;
          this.Vprofile = userData[0].perfil_media;
          this.estado = userData[0].estado;
        } else {
          this.alerta.presentAlert("Alerta", "Usuario no encontrado");
        }
      },
      error: (e: any) => {
        this.alerta.presentAlert("Fallo en carga de datos", "Error: " + e.message);
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

  onCheckboxChange(event: any) {
    this.isReadonly = event.detail.checked;
  }
  
}
