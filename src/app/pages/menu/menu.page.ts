import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/clasesdb';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  Vnick: any;
  estado: number = 0;
  Vid: any;
  any2: any;
  any3: any;
  any4: any;
  any5: any;

  constructor(private router: Router, private activatedroute: ActivatedRoute,
    private menuCtrl: MenuController, private nativestorage: NativeStorage,
    private datab: DatabaseService, private alerta: AlertService) {
    this.menuCtrl.enable(true);
    
    
  }

  async ngOnInit() {
    await this.cargaNick();
      await this.getUserData2();
  }

  async cargaNick(){
    try {
        const userData = await this.nativestorage.getItem('userData');
        this.Vnick = userData.nick;
        return true;
    } catch (error) {
        console.error("Error en Almacen Nativo: ", error);
        return null;
    }
  }


  getUserData2(){
    this.datab.fetchUser(this.Vnick).subscribe({
      next: (userData: User[]) => {
        if (userData.length > 0) {
          // Procesar datos del usuario
          this.Vid = userData[0].userID;
          this.Vnick = userData[0].nick;
          this.any2 = userData[0].correo;
          this.any3 = userData[0].perfil_media;
          this.estado = userData[0].estado;

          this.authLogged();
        } else {
          this.alerta.presentAlert("Usuario no encontrado", "");
        }
      },
      error: (e) => {
        const em = e.message;
        this.alerta.presentAlert("Fallo en carga de datos", "Error: " + em);
      }
    });
  }

  authLogged() {
    if (this.estado == 5 || this.estado == 9) {
      console.log("estado del usuario: " + this.estado)
    } else {
      this.alerta.presentAlert("Re-enviado a login", "Su usuario es inexistente o se encuentra bloqueado, IDestado: " + this.estado + "Contacte a soporte: Summonapp@soporte.cl");
      this.router.navigate(['/login']);
    }
  }


}
