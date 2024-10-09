import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //variables
  VIDuser: string = "";
  Vpassword: string = "";

  //errores
  errores = '@ViewChild';

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef

  //fakeDB
  invitado: any ={
  invitadouser: "Invitado",
  ACCESSuser: 0,
  }
  temporalUSER: any = {
    Loginuser: "Demon666",
    email: "d666n@gmail.com",
    profile: "defaultuser.png",
    password: 123123123,
    ACCESSuser: 1
  };
  temporalROOM: any = {
    IDroom: 1001,
    Creator: "Demon666",
    keyword: 1234
  };

  

  constructor(
    private router: Router,
     private activatedroute: ActivatedRoute,
      private alertcontroller: AlertController,
      private renderer2: Renderer2
      ) { 
    this.activatedroute.queryParams.subscribe(params => {
      //Validamos si viene o no información desde la pagina
      if(this.router.getCurrentNavigation()?.extras.state){
        //Capturamos la información
        this.VIDuser = this.router.getCurrentNavigation()?.extras?.state?.['IDuser']
      }
    });
  }
  
  ngOnInit() {
  }

  Ingreso(){
    // inicia If para errores
    let hasE = false;

    // Valida usuario
    if (this.VIDuser == "") {
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
      if(this.VIDuser == this.temporalUSER.Loginuser && this.Vpassword == this.temporalUSER.password){
        // Si su acceso es 1 (Mayor a rol invitado), entra al menú html
        // Para accesos 0 deben ser redireccionados a sala html
        if(this.temporalUSER.ACCESSuser == 1){
          console.log("Paso1Valida")
          let navigationextras: NavigationExtras = {
            state:{
              user: this.VIDuser,
              acce: this.temporalUSER.ACCESSuser,
            }
          }
          console.log("Paso2Valida")
          this.router.navigate(['/menu'],navigationextras);
        } 
      }
        else{const titulo = "Usuario o contraseña incorrecto";
          const mensaje = "Reintente por favor";
          this.alerta1(titulo, mensaje);
          return;
      }
      return true;
    }//fin else
  }

  async alerta1(titulo:string , mensaje: string){
    const alert = await this.alertcontroller.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}

