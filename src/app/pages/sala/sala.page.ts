import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.page.html',
  styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

  //VARIABLES
  VgrupoID!: number;
  Vnombre_sala!: string;
  VpartId!: number;
  variable: boolean = false;

  claseParticipante : any = [{
    participanteID:  '',
    nick: '',
    perfil_media:  '',
    molde: '',
  }];

  constructor(private menuCtrl: MenuController, private datab: DatabaseService,
              private nativestorage: NativeStorage, private alerta: AlertService
  ) {
    this.menuCtrl.enable(true); }

  async ngOnInit() {
    await this.cargaID();
    await this.cargaNombre();
    await this.alerta.presentAlert("Aviso",""+ this.VgrupoID)
    await this.datab.consultaparticipantes(this.VgrupoID);
    this.datab.dbState().subscribe(data=>{
      if(data){
        this.datab.fetchparticipantes().subscribe(res=>{
          this.claseParticipante = res;
          //this.alerta.presentAlert("Aviso1", "" + res);
        });

      }
    })
  }

  async cargaNombre(){
    const FUNCION = await this.datab.getGrupoNombre(this.VgrupoID);
    this.Vnombre_sala = FUNCION;
  }

  async cargaID(){
    try {
        const grupoData = await this.nativestorage.getItem('grupoData');
        this.VgrupoID = grupoData.grupoID;
        return true;
    } catch (error) {
        console.error("Error en Almacen Nativo: ", error);
        return null;
    }
  }
}

