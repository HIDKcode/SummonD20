import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { CamaraService } from 'src/app/services/camara.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { RollDiceService } from 'src/app/services/roll-dice.service';
@Component({
  selector: 'app-sala',
  templateUrl: './sala.page.html',
  styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

  //VARIABLES
  VmapaID!: number;
  isDuenioSala = false;
  Vvacia!: any;
  Vnick: any;
  VgrupoID!: number;
  Vnombre_sala!: string;
  VpartId!: number;
  Vmapa: string = '';
  Vresultado!: any;
  
  //LISTA MENSAJES
  mensajeInput: any;
  archivoAdjunto!: Blob;
  @ViewChild('chatcaja') chatcaja!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;

  name!: string;
  //LISTA PARTICIPANTES
  claseParticipante : any = [{
    participanteID:  '',
    nick: '',
    perfil_media:  '',
    molde: '',
  }];

  claseMSJ : any = [{
    msj_autor:  '',
    msj_texto:  '',
    msj_date:  '',
    msj_media:  '',
  }]

  constructor(private menuCtrl: MenuController, private datab: DatabaseService,
              private nativestorage: NativeStorage, private alerta: AlertService,
              private camaraservicio: CamaraService, private rolldice: RollDiceService) {
    this.menuCtrl.enable(true); }

  async ngOnInit() {
    
    await this.cargaGrupoID();
    await this.cargaNombre();
    await this.cargaNick();
    await this.cargaMapaID();
    await this.actualizarmapa(this.VmapaID);
    await this.datab.consultaparticipantes(this.VgrupoID);
    this.datab.dbState().subscribe(data=>{
      if(data){
        this.datab.fetchparticipantes().subscribe(res=>{
          this.claseParticipante = res;
          //this.alerta.presentAlert("Aviso1", "" + res);
        });

        
      }
    })
    await this.isDuenio();
    await this.datab.consultarmensajes(this.VgrupoID);
    await this.refrescar();
  }

  async cargaNombre(){
    const FUNCION = await this.datab.getGrupoNombre(this.VgrupoID);
    this.Vnombre_sala = FUNCION;
  }
  
  async isDuenio(){
    const duenioID = await this.datab.getOWNER(this.VgrupoID);
    const userID = await this.datab.getID(this.Vnick);

    if (duenioID == userID){
      this.isDuenioSala = true;
    } else {
      this.isDuenioSala = false;
    }
  }

  async cargaMapaID(){
    const mapaID = await this.datab.getMapaId(this.VgrupoID);
    this.VmapaID = mapaID;
  }

  async cargaGrupoID(){
    const grupoData = await this.nativestorage.getItem('grupoData');
    this.VgrupoID = grupoData.grupoID;
    return true;
  }

  async cargaNick(){
    const userData = await this.nativestorage.getItem('userData');
    this.Vnick = userData.nick;
    return true;
  } 

  

  async enviarMensaje() {
    const msjTexto = this.mensajeInput; 

    if (!msjTexto || msjTexto.trim() === '') {
      this.alerta.presentAlert('Error', 'El mensaje no puede estar vacío.');
      return;
    }
  
      await this.datab.enviarMensaje(this.Vnick, msjTexto, this.archivoAdjunto, this.VgrupoID).then(() => {
        this.mensajeInput = ''; // Limpiar el input
        this.archivoAdjunto = this.Vvacia;
        this.datab.consultarmensajes(this.VgrupoID);
        this.refrescar();
      });
    
  }

  

  ScrollBottom(): void {
    if (this.chatcaja) {
      const element = this.chatcaja.nativeElement;
      element.scrollTop = element.scrollHeight; // Desplaza al final
    }
  }

  async seleccionarArchivo() {
    this.camaraservicio.takePictureFree()
    .then((img) => {
      this.archivoAdjunto = img;
    }) 
  }

  refrescar(){
    this.datab.fetchmensajes().subscribe(res=>{
      this.claseMSJ = res;
      //this.alerta.presentAlert("Aviso", "" + res);
      setTimeout(() => {
        this.ScrollBottom();
      }, 100);
    });
  }
  
  openPopover(participanteID: number) {
    const popover = document.getElementById('popover-' + participanteID) as any;
    if (popover) {
      popover.present();
    }
  }

  
  boton1!: false;
  boton2!: true;
  boton3!: true;
  boton4!: true;
  boton5!: true;
  boton6!: true;
  boton7!: true;
  boton8!: true;
  boton9!: true;
  boton10!: true;
  boton11!: true;
  
  activarbotones(){
      for (let i = 1; i <= 11; i++) {
        (this as any)[`boton${i}`] = false;
      }
  }

  seleccion(int: number){
    this.VmapaID = int;
    this.activarbotones();
    (this as any)[`boton${int}`] = true;
  }

  confirmar(){
    this.modificadbmapa();
    this.actualizarmapa(this.VmapaID);
    this.modal.dismiss();
  }

  cancel() {
    this.modal.dismiss();
  }

  async modificadbmapa(){
    await this.datab.ModificarMapa(this.VmapaID, this.VgrupoID);
  }
  

  async actualizarmapa(int: number){
    switch(this.VmapaID){
      case 1: this.Vmapa = 'assets/images/MAPA1.png'; break;
      case 2: this.Vmapa = 'assets/images/MAPA2.png'; break;
      case 3: this.Vmapa = 'assets/images/MAPA3.png'; break;
      case 4: this.Vmapa = 'assets/images/MAPA4.png'; break;
      case 5: this.Vmapa = 'assets/images/MAPA5.png'; break;
      case 6: this.Vmapa = 'assets/images/MAPA6.png'; break;
      case 7: this.Vmapa = 'assets/images/MAPA7.png'; break;
      case 8: this.Vmapa = 'assets/images/MAPA8.png'; break;
      case 9: this.Vmapa = 'assets/images/MAPA9.png'; break;
      case 10: this.Vmapa = 'assets/images/MAPA10.png'; break;
      case 11: this.Vmapa = 'assets/images/MAPA11.png'; break;
    }
  }

  async d4(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d4')
    this.Vresultado = RESULTADO;
  }
  async d6(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d6')
    this.Vresultado = RESULTADO;
  }
  async d10(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d10')
    this.Vresultado = RESULTADO;
  }
  async d12(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d12')
    this.Vresultado = RESULTADO;
  }
  async d20(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d20')
    this.Vresultado = RESULTADO;
  }
  async d100(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d100')
    this.Vresultado = RESULTADO;
  }

} 

