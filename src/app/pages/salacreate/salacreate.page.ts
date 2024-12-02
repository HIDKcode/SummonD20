import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-salacreate',
  templateUrl: './salacreate.page.html',
  styleUrls: ['./salacreate.page.scss'],
})
export class SalacreatePage implements OnInit {

  Vnick!: string;

  nombre: string = "";
  descr: string = "";
  clave!: number;
  Variable: any;
  VgrupoID!: number;


  constructor(private router: Router,
    private alerta: AlertService,
    private menuCtrl: MenuController,
    private datab: DatabaseService,
    private nativestorage: NativeStorage){
    this.menuCtrl.enable(true); 
    this.cargaNick();

  }

  ngOnInit() {
    this.datab.acceso();
  }

  irSalalistas(){
    this.router.navigate(['/salalistas'])
  }

  async Valida(){
    let hasE = false;
    // Validador de limite valor
    if(this.nombre == ""){hasE = true;}
    if(this.descr == ""){hasE = true;}
    if(this.clave < 100000 || this.clave > 999999){hasE = true;}

    // Si hay algún error, parará aquí.
    if (hasE) {
        this.alerta.presentAlert("Datos invalidos", "Reintente por favor");
      return false;
    }   

    try { 
      const grupoID = await this.datab.insertGrupo(this.nombre, this.descr, this.clave, this.Vnick);
    } catch (e: any) {
      this.alerta.presentAlert("Error", "No se pudo crear la sala: " + e.message); 
    }
    return true;
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

}
