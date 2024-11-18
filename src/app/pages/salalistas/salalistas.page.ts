import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-salalistas',
  templateUrl: './salalistas.page.html',
  styleUrls: ['./salalistas.page.scss'],
})
export class SalalistasPage implements OnInit {

  grupos : any = [{
    grupodID:  '',
    grupo_nombre: '',
    descripcion: '',
    duenio_sala: '',
    cant_user: '',
    clavevacia: '',
  }];

  misgrupos : any = [{
    grupodID:  '',
    grupo_nombre: '',
    duenio_sala: '',
    cant_user: '',
    clavevacia: '',
  }];

  pass!: number;
  Vnick!: string;

  Gnombre: string = "";
  Gdescr: string = "";
  Gclave!: number;
  Variable: any;
  VgrupoID!: number;

  @ViewChild('Listar', {static: true}) div1!: ElementRef
  @ViewChild('Crear', {static: true}) div2!: ElementRef
  
  constructor(private router: Router,
    private alerta: AlertService,
    private menuCtrl: MenuController,
    private datab: DatabaseService,
    private nativestorage: NativeStorage){
    this.menuCtrl.enable(true); 
    this.cargaNick();
  }

  ngOnInit() {
    this.lGrupos();
    this.lmisGrupos();
  }

  irSalacreate(){
    this.router.navigate(['/salacreate'])
  }
  
  async participar(grupoID: number, clavevacia: number) {
    let hasE = false;

    if (this.pass <= 99999 || this.pass > 99999){
      hasE = true;
    }
    // Si hay errores, detiene la ejecución
    if (hasE) {
      return false;
    } 

    const VALIDADOR = await this.datab.validaClaveGrupo(grupoID, clavevacia);
    if (VALIDADOR) {
      try {
        await this.datab.insertParticipante(this.Vnick, grupoID);
        this.router.navigate(['/sala', grupoID]);
        return true;
      } catch (e) {
        this.alerta.presentAlert("Error unirse a grupo:", "" + e);
      }
    } else {
      this.alerta.presentAlert("Clave errónea", "Contacte al dueño de la sala");
    }
    return false;
  }

  lGrupos() {
    this.datab.ListaGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (e) => {
        const em = e.message
        this.alerta.presentAlert("Error al cargar los grupos:", "" + em);
      },
      complete: () => {
        console.log('Carga de grupos completada.');
      }
      
    });
  }

  lmisGrupos(){
    this.datab.ListaMisGrupos(this.Vnick).subscribe({
      next: (misgrupos) => {
        this.misgrupos = misgrupos;
      },
      error: (e) => {
        const em = e.message
        this.alerta.presentAlert("Error al cargar los grupos:", "" + em);
      },
      complete: () => {
        console.log('Carga de grupos completada.');
      }
      
    });
  }

  irmigrupo(grupoID: number) {
        this.router.navigate(['/sala', grupoID]);
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
