import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IonModal } from '@ionic/angular';
import { MailjsService } from 'src/app/services/mailjs.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
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
  StoreNombre!: string;
  StoreCorreo!: string;
  Vcodigo!: string;
  botonDeshabilitado: boolean = false;
  visible: boolean = false;
  
  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef

  @ViewChild(IonModal) modal!: IonModal;
 

  constructor(
    private alerta: AlertService, private renderer2: Renderer2,
    private datab: DatabaseService, private router: Router,
    private menuCtrl: MenuController, private mailjs: MailjsService
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
      
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "¡Bienvenido!",
            body: "Recuerda revisar las nuevas funciones de grupos!",
            sound: 'default',
            largeIcon: 'assets/images/logo',
            smallIcon: 'assets/images/logo',
          },
        ],
      });

      await this.router.navigate(['/menu'], navigationExtras);
      this.limpiar();
      return true;
    } else {
      this.alerta.presentAlert("Usuario o contraseña incorrecto", "Reintente por favor");
      return false;
    }

  } catch (e: any) {
    this.datab.logError("Funcion Ingreso", e.code ||': '|| e.message)
    this.alerta.presentAlert("Error de sistema", "Reintente o contacte soporte por error");
    return false; 
  }
} 

  cancel(){
    this.modal.dismiss(null);
  }
  
  async Recuperar(){
    const status = await Network.getStatus();
    let hasE = false;
    const regexprohibido = /['";()--/*<>\\{}\[\]]|\s(OR|AND|DROP|SELECT|INSERT|DELETE|UPDATE)\s/i;
    this.Vnombre = this.Vnombre.toLowerCase();
    this.Vcorreo = this.Vcorreo.toLowerCase();
    
    if (!status.connected) {
      this.alerta.presentAlert("Error de conexión","No se puede completar la solicitud. Por favor, verifica tu conexión a Internet."
      );
      return;
    }

    if (this.Vnombre === "" || regexprohibido.test(this.Vnombre)) {
      hasE = true;
    }
    if (this.Vcorreo === "" || regexprohibido.test(this.Vcorreo)) {
      hasE = true;
    } 
    if (!this.exprMail.test(this.Vcorreo)){
      hasE = true;
    }
    

    if (hasE) {
      this.alerta.presentAlert("Recuperación de clave","Formatos incorrectos, reintente por favor");
      return false;
    }
    this.envia();
    return;
  }

  async ValidaCodigo(){
    const regexprohibido = /['";()--/*<>\\{}\[\]]|\s(OR|AND|DROP|SELECT|INSERT|DELETE|UPDATE)\s/i;
    if (this.Vcodigo === "" || regexprohibido.test(this.Vcodigo)) {
      this.alerta.presentAlert("Codigo de recuperación", "Codigo vacío o caracter inválido");
      return false;
    } 
    const VALIDA = await this.datab.validaCodigo(this.Vcodigo, this.StoreNombre);
    if(VALIDA){
      this.alerta.presentAlert("Codigo de recuperación","Codigo exitoso, redirigido a cambio de contraseña")
      let navigationExtras: NavigationExtras = {
        state: {
          Vnick: this.StoreNombre
        }
      }
      this.modal.dismiss(null);
      await this.router.navigate(['/recuperarclave'], navigationExtras);
    } else {
      this.alerta.presentAlert("Codigo de recuperación", "Codigo incorrecto, reintente o contacte soporte.");
    }
    return;
  }


  async envia(){
    this.alerta.presentAlert("Recuperación de clave","Si los datos son válidos se ha enviado a su correo un codigo de seguridad con una validez de 5 minutos.")
    // Guardamos variables y borramos las de formulario
    this.StoreNombre = this.Vnombre;
    this.StoreCorreo = this.Vcorreo;
    this.Vnombre = '';
    this.Vcorreo = '';
    // para habilitar boton de recuperar() despues de 8sg
    this.botonDeshabilitado = true; 
    setTimeout(() => {
      this.botonDeshabilitado = false; 
    }, 8000);
    // Mostramos formulario y boton de codigo seg, sean o no validos los datos. Se oculta después de 300sg
    this.visible = true; 
    setTimeout(() => {
      this.visible = false;
    }, 300000);
    // Generamos codigo, lo enviamos y se genera un delete a 300sg apx
    const VALIDADOR = await this.datab.validaRecuperar(this.StoreNombre, this.StoreCorreo);
    if (VALIDADOR){
      const random = this.datab.generarClaveAleatoria();
      await this.datab.ModificarCodigoSeguridad(this.StoreNombre, random);
      await this.mailjs.enviarCorreo(this.StoreNombre, this.StoreCorreo, random);
      setTimeout(() => {
        this.datab.NullifyCodigoSeguridad(this.StoreNombre);
      }, 300000);
    }
  }
  
  limpiar(){
    this.Vnick = '';
    this.Vpassword = '';
  }
 
  
}

