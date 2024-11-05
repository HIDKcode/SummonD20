import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-configclave',
  templateUrl: './configclave.page.html',
  styleUrls: ['./configclave.page.scss'],
})
export class ConfigclavePage implements OnInit {

  constructor(private alerta: AlertService ,private renderer2: Renderer2, 
    private datab: DatabaseService) { }

  ngOnInit() {
  }

  Vpass: any;
  Vpass2: any;
  variable: boolean = false;

  exprPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{7,}$/;

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef

  CambiarPass(){
    // While loop con variable boolean
    while(this.variable == false){
      // inicia If para errores
      let hasE = false;

    // Valida pass 1
    if (this.Vpass == "" || !this.exprPass.test(this.Vpass)) {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    // Revisa si Pass1 = Pass2
    if (this.Vpass != this.Vpass2) {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
    }

    // Si hay algún error, parará aquí.
    if (hasE) {
      return false;
    }
      this.variable = true;
    }

    // Funcion con data base aquí 

      return true;
 
  }

}
