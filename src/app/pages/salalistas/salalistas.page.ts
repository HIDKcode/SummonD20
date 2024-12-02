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
    grupoID:  '',
    nombre_sala:  '',
    descripcion:  '',
    owner:  '',
    clavevacia: '',
  }];

  misgrupos : any = [{
    grupoID:  '',
    nombre_sala:  '',
    descripcion:  '',
    owner:  '',
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

  }

  async ngOnInit() {
    this.datab.acceso();
    await this.cargaNick();
    this.datab.consultamisgrupos(this.Vnick);
    this.datab.consultagrupos();
    this.datab.dbState().subscribe(data=>{
      if(data){
      
        this.datab.fetchmisgrupos().subscribe(res=>{
          this.misgrupos = res;
          //this.alerta.presentAlert("Aviso", "" + res);
        });

        

        this.datab.fetchgrupos().subscribe(res=>{
          this.grupos = res;
          //this.alerta.presentAlert("Aviso2", "" + res);
        });

      }
    })
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
        this.irmigrupo(grupoID);
        return true;
      } catch (e) {
        this.alerta.presentAlert("Error unirse a grupo:", "Contacte soporte");
      }
    } else {
      this.alerta.presentAlert("Clave errónea", "Contacte al dueño de la sala");
    }
    return false;
  }

  async irmigrupo(grupoID: number) {
        await this.nativestorage.setItem('grupoData',{grupoID});
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
