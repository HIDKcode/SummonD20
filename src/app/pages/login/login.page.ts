import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { MailjsService } from 'src/app/services/mailjs.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variables nG
  VuserID!: number;
  Vpassword: string = "";
  Vnick: string = "";

  //regex
  exprMail = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;

  Vnombre!: string;
  Vcorreo!: string;
  Vrespuesta!: string;
  botonDeshabilitado: boolean = false;

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef
  @ViewChild(IonModal) modal!: IonModal;

  constructor(
    private alerta: AlertService,
    private renderer2: Renderer2,
    private datab: DatabaseService,
    private router: Router,
    private menuCtrl: MenuController,
    private mailjs: MailjsService
  ) {
    this.menuCtrl.enable(false);
  }
  
  ngOnInit() {
  }

  async Ingreso() {
  let hasE = false;
  const regexprohibido = /[';()--*/]/;

  if (this.Vnick === "" || regexprohibido.test(this.Vnick)) {
    this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
  }

  if (this.Vpassword === "" || regexprohibido.test(this.Vpassword)) {
    this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
  }
  if (hasE) {
    return false;
  }

  this.Vnick = this.Vnick.toLowerCase();

  try {
    const VALIDADOR = await this.datab.validaClave(this.Vnick, this.Vpassword);
    if (VALIDADOR) {
      await this.datab.LoginUser(this.Vnick);

      let navigationExtras: NavigationExtras = {
        state: {
          Vnick: this.Vnick
        }
      };
      await this.router.navigate(['/menu'], navigationExtras);
      this.limpiar();
      return true;
    } else {
      this.alerta.presentAlert("Usuario o contraseña incorrecto", "Reintente por favor");
      return false;
    }

  } catch (e) {
    this.alerta.presentAlert("Error de sistema", "Reintente o contacte soporte por error: " + e);
    return false; 
  }
} 

  cancel() {
    this.modal.dismiss(null);
  }
  
  Recuperar(){
    let hasE = false;
    const regexprohibido = /['";()--/*<>\\{}\[\]]|\s(OR|AND|DROP|SELECT|INSERT|DELETE|UPDATE)\s/i;

    this.Vnombre = this.Vnombre.toLowerCase();

    if (this.Vnombre === "" || regexprohibido.test(this.Vnombre)) {
      hasE = true;
    }
    if (this.Vcorreo === "" || regexprohibido.test(this.Vcorreo)) {
      hasE = true;
    } 
    if (!this.exprMail.test(this.Vcorreo)){
      hasE = true;
    }
    if (this.Vrespuesta === "" || regexprohibido.test(this.Vrespuesta)) {
      hasE = true;
    } 

    if (hasE) {
      this.alerta.presentAlert("Formatos incorrectos","Reintente por favor");
      return false;
    }
    this.envia();
    
    return;
  }

  async envia(){
    const VALIDADOR = await this.datab.validaRecuperar(this.Vnombre, this.Vcorreo, this.Vrespuesta);
    if (VALIDADOR){
      const random = this.datab.generarClaveAleatoria();
      await this.datab.modificaClaveEnSec(random, this.Vnombre);
      await this.datab.modificaEstadoEnSecreto(1,this.Vnombre)
      await this.mailjs.enviarCorreo(this.Vnombre, this.Vcorreo, random);
    }
    this.botonDeshabilitado = true;
    setTimeout(() => {
      this.botonDeshabilitado = false; // para habilitarlo despues de 8sg
    }, 8000);
    this.alerta.presentAlert("Recuperación de contraseña","Si la información es correcta, se enviará respuesta a su correo, de otras maneras contacte a soporte.")
  }
  limpiar(){
    this.Vnick = '';
    this.Vpassword = '';
  }
}

