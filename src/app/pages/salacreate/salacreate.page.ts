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

  Gnombre: string = "";
  Gdescr: string = "";
  Gclave!: number;
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
  }

  irSalalistas(){
    this.router.navigate(['/salalistas'])
  }

  async Valida(){
    let hasE = false;
    // Validador de limite valor
    if(this.Gnombre == "" ){hasE = true;}
    if(this.Gdescr == "" ){hasE = true;}
    if(this.Gclave < 100000 || this.Gclave > 999999){hasE = true;}

    // Si hay algún error, parará aquí.
    if (hasE) {
        this.alerta.presentAlert("Datos invalidos", "Reintente por favor");
      return false;
      // Si no hay errores, continúa creando
      } else {
        try { 
          const grupoID = await this.datab.insertGrupo(this.Gnombre, this.Gdescr, this.Gclave);

        } catch (e: any) {
          const em = e.message
          this.alerta.presentAlert("Error", "No se pudo crear la sala: " + em); 
        }
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
