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
  
  while(this.variable == false){
    if(this.IDuser == "" || this.IDuser.length <= 5){
      this.renderer2.setStyle(
      this.er1.nativeElement, 'display', 'flex');
      return false;
        } else { this.renderer2.setStyle(
          this.er1.nativeElement, 'display', 'none'); }
  
  if(!this.email.includes("@")){
      this.renderer2.setStyle(
      this.er2.nativeElement, 'display', 'flex');
      return false;
        } else { this.renderer2.setStyle(
          this.er2.nativeElement, 'display', 'none'); }
  
  if(this.pass1 == ""){
      this.renderer2.setStyle(
      this.er3.nativeElement, 'display', 'flex');
      return false;
        } else { this.renderer2.setStyle(
          this.er3.nativeElement, 'display', 'none'); }

  if(this.pass1 != this.pass2){
      this.renderer2.setStyle(
      this.er4.nativeElement, 'display', 'flex');
      return false;
        } else { this.renderer2.setStyle(
          this.er4.nativeElement, 'display', 'none'); }
    
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

  validalenght(){

    if(this.pass1){
     
    }
    
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
