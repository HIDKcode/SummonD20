import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  VuserID!: number;
  Vpassword: string = "";
  Vnick: string = "";
  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef

  constructor(
    private alerta: AlertService,
    private renderer2: Renderer2,
    private datab: DatabaseService,
    private router: Router,
    private menuCtrl: MenuController,
    private nativestorage: NativeStorage
  ) {
    this.menuCtrl.enable(false);
  }
  
  ngOnInit() {
  }

  async Ingreso(){
    // inicia If para errores
    let hasE = false;

    // Valida usuario
    if (this.Vnick == "") {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    // Valida Pass
    if (this.Vpassword == "") {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
    }
    // Si hay algún error, parará aquí.
    if (hasE) {
      return false;
    } 
    else{
      // Validador de Usuario
      await this.datab.validaClave(this.Vnick);
      const ClaveBD = await this.datab.getPass();
      if(ClaveBD == this.Vpassword){       
        this.datab.fetchUser(this.Vnick)
        let navigationExtras: NavigationExtras = {
          state: {
            Vnick: this.Vnick
          }
        }
        this.router.navigate(['/menu'],navigationExtras)
      }
        else{
          const titulo = "Usuario o contraseña incorrecto";
          const mensaje = "Reintente por favor";
          this.alerta.presentAlert(titulo, mensaje);
          return;
      }
      return true;
    }//fin else
  }

  
}

