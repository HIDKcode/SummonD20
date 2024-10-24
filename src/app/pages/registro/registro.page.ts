import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //errores
  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef
  @ViewChild('error3', {static: true}) er3!: ElementRef
  @ViewChild('error4', {static: true}) er4!: ElementRef

  //variables
  exprMail = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  exprPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{7,}$/;
  variable: boolean = false;
  Vnick: string = "";
  Vcorreo: string = "";
  Vpass: string = "";
  Vpass2: string = "";
  ACCESSuser: number = 1;

  constructor(private router: Router,private activatedroute: ActivatedRoute,private alerta: AlertService ,private renderer2: Renderer2
  ) {
      this.activatedroute.queryParams.subscribe(params => {
        //Validamos si viene o no información desde la pagina
        if(this.router.getCurrentNavigation()?.extras.state){
          //Capturamos la información
          this.Vnick= this.router.getCurrentNavigation()?.extras?.state?.['Snick']
          this.Vcorreo = this.router.getCurrentNavigation()?.extras?.state?.['Scorreo']
          this.Vpass = this.router.getCurrentNavigation()?.extras?.state?.['Spass']
          this.Vpass2 = this.router.getCurrentNavigation()?.extras?.state?.['Spass2']
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

  // Valida pass 1
  if (this.Vpass == "" || !this.exprPass.test(this.Vpass)) {
    this.renderer2.setStyle(this.er3.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er3.nativeElement, 'display', 'none');
  }

  // Revisa si Pass1 = Pass2
  if (this.Vpass != this.Vpass2) {
    this.renderer2.setStyle(this.er4.nativeElement, 'display', 'flex');
    hasE = true;
  } else {
    this.renderer2.setStyle(this.er4.nativeElement, 'display', 'none');
  }

  // Si hay algún error, parará aquí.
  if (hasE) {
    return false;
  }
  
    this.variable = true;
  }

    let navigationextras: NavigationExtras = {
      state:{
        user: this.Vnick,
      }
    }
    this.router.navigate(['/login'],navigationextras);
    return true;
  }

}
