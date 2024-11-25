import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  Vnick: any;
  VgrupoID!: number;
  Vnombre_sala!: string;
  VpartId!: number;
  variable: boolean = false;
  //LISTA MENSAJES
  mensajeInput: any;
  mensajes: any[] = [];
  @ViewChild('chatcaja') chatcaja!: ElementRef;
  //LISTA PARTICIPANTES
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
    await this.cargaNick();

    await this.datab.consultaparticipantes(this.VgrupoID);
    this.datab.dbState().subscribe(data=>{
      if(data){
        this.datab.fetchparticipantes().subscribe(res=>{
          this.claseParticipante = res;
          //this.alerta.presentAlert("Aviso1", "" + res);
        });

        
      }
    })

    await this.datab.consultarmensajes(this.VgrupoID);
    await this.refrescar();
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

  async enviarMensaje() {
    const msjTexto = this.mensajeInput; 

    if (!msjTexto || msjTexto.trim() === '') {
      this.alerta.presentAlert('Error', 'El mensaje no puede estar vacío.');
      return;
    }
  
    const msjAutor = this.Vnick; 
    const msjMedia = null; 
  
    await this.datab.enviarMensaje(msjAutor, msjTexto, msjMedia, this.VgrupoID, this.Vnick).then(() => {
      this.mensajeInput = ''; // Limpiar el input
      this.datab.consultarmensajes(this.VgrupoID);
      this.refrescar();
    });
  }

  refrescar(){
    this.datab.fetchmensajes().subscribe(res=>{
      this.mensajes = res;
      //this.alerta.presentAlert("Aviso", "" + res);
      setTimeout(() => {
        this.ScrollBottom();
      }, 100);
    });
  }

  ScrollBottom(): void {
    if (this.chatcaja) {
      const element = this.chatcaja.nativeElement;
      element.scrollTop = element.scrollHeight; // Desplaza al final
    }
  }

}

