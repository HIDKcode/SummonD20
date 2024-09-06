import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //variables
  IDuser: string = " ";
  password!: string;

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
      private alertcontroller: AlertController
      ) { 
    this.activatedroute.queryParams.subscribe(params => {
      //Validamos si viene o no información desde la pagina
      if(this.router.getCurrentNavigation()?.extras.state){
        //Capturamos la información
        this.IDuser = this.router.getCurrentNavigation()?.extras?.state?.['IDuser']
      }
    });
  }
  
  ngOnInit() {
  }


  Ingreso(){
    if(this.IDuser == this.temporalUSER.Loginuser && this.password == this.temporalUSER.password){
      // Si su acceso es 1 (Mayor a rol invitado), entra al menú html
      // Para accesos 0 deben ser redireccionados a sala html
      if(this.temporalUSER.ACCESSuser == 1){
        console.log("holamundo")
        let navigationextras: NavigationExtras = {
          state:{
            user: this.IDuser,
            acce: this.temporalUSER.ACCESSuser,
          }
        }
        console.log("holamundo2")
        this.router.navigate(['/menu'],navigationextras);
      } 
    }
    else{const titulo = "Usuario o contraseña incorrecto";
      const mensaje = "Reintente por favor";
      this.alerta1(titulo, mensaje);
      return;
    }
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

