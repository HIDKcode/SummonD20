import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

  
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
})

export class BibliotecaPage implements OnInit {

  // VARIABLES

  Vnick!: string;
  bibliotecaID!: number;

  claseArchivo : any = [{
    archivoID:  '',
    archivo:  '',
    extension:  '',
    tamaño:  '',
    subida_date:  '',
  }];

  constructor(private alerta: AlertService, private datab: DatabaseService,
    private menuCtrl: MenuController, private nativestorage: NativeStorage) {
      this.menuCtrl.enable(true);
     }

  async ngOnInit() {
    await this.cargaNick();
    this.bibliotecaID = await this.datab.getID(this.Vnick);
    await this.datab.consultaarchivos(this.bibliotecaID);
    this.datab.dbState().subscribe(data=>{
      if(data){
      
        this.datab.fetcharchivos().subscribe(res=>{
          this.claseArchivo = res;
          //this.alerta.presentAlert("Aviso", "" + res);
        });

      }
    })
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
