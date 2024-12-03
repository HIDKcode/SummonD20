import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-recuperarclave',
  templateUrl: './recuperarclave.page.html',
  styleUrls: ['./recuperarclave.page.scss'],
})
export class RecuperarclavePage implements OnInit {
//variables
Vnick!: string;
Vpass!: string;
Vpass2!: string;

exprPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{7,}$/;

@ViewChild('error1', {static: true}) er1!: ElementRef
@ViewChild('error2', {static: true}) er2!: ElementRef


constructor(private alerta: AlertService ,private renderer2: Renderer2, 
  private datab: DatabaseService, private menuCtrl: MenuController,
  private activatedroute: ActivatedRoute, private router: Router) {
    this.menuCtrl.enable(false);

    
   }

async ngOnInit() {
  this.activatedroute.queryParams.subscribe(params => {
    if(this.router.getCurrentNavigation()?.extras.state){
      this.Vnick = this.router.getCurrentNavigation()?.extras?.state?.['Vnick'];
    }
  });

}

async CambiarPass(){
      let hasE = false;

    if (this.Vpass == "" || !this.exprPass.test(this.Vpass)) {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    if (this.Vpass != this.Vpass2) {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
    }

    const regexprohibido = /['";()--/*<>\\{}\[\]]|\s(OR|AND|DROP|SELECT|INSERT|DELETE|UPDATE)\s/i;
    if(regexprohibido.test(this.Vpass)){
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    if (hasE) {
      return false;
    }
      await this.datab.modificaClave(this.Vpass, this.Vnick);
      this.router.navigate(['/login']);
    return;
  }
  
  volver(){
    this.router.navigate(['/login'])
  }
}

