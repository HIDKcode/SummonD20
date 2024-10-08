import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //errores
  errores = '@ViewChild';

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef
  @ViewChild('error3', {static: true}) er3!: ElementRef
  @ViewChild('error4', {static: true}) er4!: ElementRef

  //variables
  exprMail = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  exprPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{7,}$/;
  variable: boolean = false;
  IDuser: string = "";
  email: string = "";
  pass1: string = "";
  pass2: string = "";
  ACCESSuser: number = 1;

  constructor(private router: Router,
    private activatedroute: ActivatedRoute,
    private alertcontroller: AlertController,
    private renderer2: Renderer2
  ) {
      this.activatedroute.queryParams.subscribe(params => {
        //Validamos si viene o no información desde la pagina
        if(this.router.getCurrentNavigation()?.extras.state){
          //Capturamos la información
          this.IDuser = this.router.getCurrentNavigation()?.extras?.state?.['user']
          this.email = this.router.getCurrentNavigation()?.extras?.state?.['mail']
          this.pass1 = this.router.getCurrentNavigation()?.extras?.state?.['1pass']
          this.pass2 = this.router.getCurrentNavigation()?.extras?.state?.['2pass']
        }
      });
      }
      
  ngOnInit() {
  }

 
  Registro(){
    
  // While loop con variable boolean
  while(this.variable == false){
    // inicia If para errores
    let hasE = false;

  // Valida usuario
  if (this.IDuser == "" || this.IDuser.length <= 5) {
    this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
  }

  // Valida email
  if (this.email == "" || !this.exprMail.test(this.email)) {
    this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
  }

  // Valida pass 1
  if (this.pass1 == "" || !this.exprPass.test(this.pass1)) {
    this.renderer2.setStyle(this.er3.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er3.nativeElement, 'display', 'none');
  }

  // Revisa si Pass1 = Pass2
  if (this.pass1 != this.pass2) {
    this.renderer2.setStyle(this.er4.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er4.nativeElement, 'display', 'none');
  }

  // If there are any errors, stop here
  if (hasE) {
    return false;
  }
    this.variable = true;
  }

    let navigationextras: NavigationExtras = {
      state:{
        user: this.IDuser,
        acce: this.ACCESSuser,
      }
    }
    console.log("holamundo2")
    this.router.navigate(['/login'],navigationextras);
    return true;
  }

  async alertaRegis(titulo:string , mensaje: string){
    const alert = await this.alertcontroller.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}
