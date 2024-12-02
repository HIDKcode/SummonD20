import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-configclave',
  templateUrl: './configclave.page.html',
  styleUrls: ['./configclave.page.scss'],
})


export class ConfigclavePage implements OnInit {

  //variables
  Vid!: any;
  estado!: any;

  Vnick!: string;
  Claveoriginal!: string;
  Vpass!: string;
  Vpass2!: string;
  variable: boolean = false;

  exprPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{7,}$/;

  @ViewChild('error1', {static: true}) er1!: ElementRef
  @ViewChild('error2', {static: true}) er2!: ElementRef
  @ViewChild('error3', {static: true}) er3!: ElementRef


  constructor(private alerta: AlertService ,private renderer2: Renderer2, 
    private datab: DatabaseService, private menuCtrl: MenuController,
    private navCtrl: NavController, private nativestorage: NativeStorage,
    private activatedroute: ActivatedRoute, private router: Router) {
      this.menuCtrl.enable(true);

      this.activatedroute.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation()?.extras.state){
          this.Vid = this.router.getCurrentNavigation()?.extras?.state?.['Vid'];
          this.estado = this.router.getCurrentNavigation()?.extras?.state?.['estado'];
        }
      });

     }

  async ngOnInit() {
    await this.cargaNick();
  }

  async CambiarPass(){
      let hasE = false;

    if (this.Vpass == "") {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er1.nativeElement, 'display', 'none');
    }

    if (this.Vpass == "" || !this.exprPass.test(this.Vpass)) {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er2.nativeElement, 'display', 'none');
    }

    if (this.Vpass != this.Vpass2) {
      this.renderer2.setStyle(this.er3.nativeElement, 'display', 'flex');
      hasE = true;
    } else {
      this.renderer2.setStyle(this.er3.nativeElement, 'display', 'none');
    }

    if (hasE) {
      return false;
    }
      await this.datab.modificaClave(this.Vpass, this.Vnick);
    return;
  }

  volver() {
    this.navCtrl.back(); //página anterior del historial
  }

  async cargaNick(){
    try {
        const userData = await this.nativestorage.getItem('userData');
        this.Vnick = userData.nick;
        return true;
    } catch (error) {
        console.error("Error Native Storage:", error);
        return null;
    }
  }
}
