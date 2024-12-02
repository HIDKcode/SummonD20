import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertService } from './services/alert.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  constructor(private router: Router, private nativestorage: NativeStorage, private alerta: AlertService, private datab: DatabaseService) {
    
  }

  ngOnInit() {

  }

  irPrincipal(){
    this.router.navigate(['/menu'])
  }

  irSala(){
    this.router.navigate(['/salalistas'])
  }

  irBiblioteca(){
    this.router.navigate(['/biblioteca'])
  }

  irDados(){
    this.router.navigate(['/rolldice'])
  }

  irConfig(){
    this.router.navigate(['/configuracion'])
  }

  async Logout(){
    try {
      await this.datab.logoff();
      await this.nativestorage.remove('userData')
      await this.router.navigate(['/login']);
      await this.alerta.presentAlert("Cierre de sesión","Realizado con éxito");
    } catch (error) {
      console.error('Error en servidor', "Error en cierre de sesión, contacte soporte");
    }
  }
}
