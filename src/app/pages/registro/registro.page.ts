import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';


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

  constructor(private router: Router,
    private alerta: AlertService,
    private renderer2: Renderer2,
    private menuCtrl: MenuController,
    private datab: DatabaseService) {

      this.menuCtrl.enable(false);
      
      }
      
  ngOnInit() {
  }

 
  async Registro() {

    let hasE = false;
    const regexprohibido = /['";()--/*<>\\{}\[\]]|\s(OR|AND|DROP|SELECT|INSERT|DELETE|UPDATE)\s/i;
  
    // Validador de caracteres prohibidos
    if (regexprohibido.test(this.Vnick) || regexprohibido.test(this.Vcorreo)) {
      hasE = true;
    }
    if (regexprohibido.test(this.Vpass)){
      hasE = true;
    }
    //Validadores de formulario
    if (this.Vnick == "" || this.Vnick.length <= 5) {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    if (this.Vcorreo == "" || !this.exprMail.test(this.Vcorreo)) {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
    }

    if (this.Vpass == "" || !this.exprPass.test(this.Vpass)) {
      this.renderer2.setStyle(this.er3.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er3.nativeElement, 'display', 'none');
    }
  
    if (this.Vpass != this.Vpass2) {
      this.renderer2.setStyle(this.er4.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er4.nativeElement, 'display', 'none');
    }
  
    // Si hay errores, para aqui
    if (hasE) {
      return false;
    }

    this.Vnick = this.Vnick.toLowerCase();
    this.Vcorreo = this.Vcorreo.toLowerCase();

    const unico = await this.datab.Unico(this.Vnick, this.Vcorreo);
    if (!unico) {
      this.alerta.presentAlert("Proceso de registro", "Correo o Usuario ya existentes");
      return false;
    }

    const result = await this.datab.registerUser(this.Vnick, this.Vcorreo, this.Vpass);
    if (result) {
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  } 

}
