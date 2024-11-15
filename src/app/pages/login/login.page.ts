import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
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

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef

  constructor(
    private alerta: AlertService,
    private renderer2: Renderer2,
    private datab: DatabaseService,
    private router: Router,
    private menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }
  
  ngOnInit() {
  }

  async Ingreso() {
  let hasE = false;
  const regexprohibido = /[';()--]/;

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
      await this.datab.fetchUser(this.Vnick);

      let navigationExtras: NavigationExtras = {
        state: {
          Vnick: this.Vnick
        }
      };
      await this.router.navigate(['/menu'], navigationExtras);
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

}

