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

  grupos: any[] = []; 
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
    
  }

  irSalacreate(){
    this.router.navigate(['/salacreate'])
  }
  
  async participar(grupoID: number) {
    if (this.pass > 99999 ){
      this.datab.validaGrupoPass(grupoID);
      const ClaveBD = await this.datab.getPass();
      if(Number(ClaveBD) == this.pass){
      try {
        // Llama a la función del servicio para unirse al grupo
        await this.datab.insertParticipante(this.Vnick, grupoID);
        // Redirige al usuario a la sala
        this.router.navigate(['/sala', grupoID]);
      } catch (e) {
        this.alerta.presentAlert("Error unirse a grupo:", "Error: "+JSON.stringify(e));
      }
      }else{this.alerta.presentAlert("Clave erronea" ,"Contacte a dueño de sala")}
    }
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
