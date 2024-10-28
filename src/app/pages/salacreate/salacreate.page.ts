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


  grupos: any[] = []; 

  pass!: number;
  Gnombre: string = "";
  Gdescr: string = "";
  Gclave!: number;
  Variable: any;
  VgrupoID: number = 0;
  @ViewChild('Listar', {static: true}) div1!: ElementRef
  @ViewChild('Crear', {static: true}) div2!: ElementRef
  
  constructor(private router: Router,
    private alerta: AlertService,
    private renderer2: Renderer2, 
    private menuCtrl: MenuController,
    private datab: DatabaseService,
    private nativestorage: NativeStorage){
    this.menuCtrl.enable(true); 

  }

  ngOnInit() {
    this.lGrupos();
    this.Ocultar();

  }

  
  async participar(grupoID: number) {
    try {
      // Recupera el userID almacenado en NStorage
      const userData = await this.nativestorage.getItem('userData');
      const userID = userData.userID;
      // Llama a la función del servicio para unirse al grupo
      await this.datab.insertParticipante(userID, grupoID);
      // Redirige al usuario a la sala
      this.router.navigate(['/sala', grupoID]);
    } catch (e) {
      this.alerta.presentAlert("Error unirse a grupo:", "Error: "+JSON.stringify(e));
    }
  }

  lGrupos() {
    this.datab.ListaGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (e) => {
        const em = e.message
        this.alerta.presentAlert("Error al cargar los grupos:", em);
      },
      complete: () => {
        console.log('Carga de grupos completada.');
      }
      
    });
  }

  async Valida(){
    let hasE = false;

    // Validador de limite valor
    if(this.Gnombre == "" ){hasE = true;}
    if(this.Gdescr == "" ){hasE = true;}
    if(this.Gclave < 0){hasE = true;}

    // Si hay algún error, parará aquí.
    if (hasE) {
        this.alerta.presentAlert("Datos invalidos", "Reintente por favor");
      return false;
      // Si no hay errores, continúa creando
      } else {
        try {
          // Llama a la función para crear el grupo
          const userData = await this.nativestorage.getItem('userData');
          const userID = userData.userID;
          const userID2 = userData.userID;
          const grupoID = await this.datab.insertGrupo(this.Gnombre, this.Gdescr, this.Gclave, userID);
          
        } catch (e: any) {
          const em = e.message
          this.alerta.presentAlert("Error", "No se pudo crear la sala: " + em);
        }
      }
      return true;
  }

  Ocultar(){
    this.renderer2.setStyle(this.div2.nativeElement, 'display', 'none');
    this.renderer2.setStyle(this.div1.nativeElement, 'display', 'contents');
  }
  Mostrar(){
    this.renderer2.setStyle(this.div1.nativeElement, 'display', 'none');
    this.renderer2.setStyle(this.div2.nativeElement, 'display', 'contents');
  }
}
