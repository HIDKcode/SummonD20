import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/services/clasesdb';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-salacreate',
  templateUrl: './salacreate.page.html',
  styleUrls: ['./salacreate.page.scss'],
})
export class SalacreatePage implements OnInit {

  arregloUser: any = [{
    userID: '', 
    nick: '',          
  }]

  grupos: any[] = []; 

  VuserID!: number;
  Vnick!: string;
  Vcorreo!: string;
  pass: string = "";

  Gnombre: string = "";
  Gdescr: string = "";
  Gclave!: number;
  Variable: any;
  VgrupoID!: number;

  @ViewChild('Listar', {static: true}) div1!: ElementRef
  @ViewChild('Crear', {static: true}) div2!: ElementRef
  
  constructor(private router: Router,
    private alerta: AlertService,
    private renderer2: Renderer2, 
    private menuCtrl: MenuController,
    private datab: DatabaseService,
    private nativestorage: NativeStorage){
    this.menuCtrl.enable(true); 
    this.cargaNick();
    this.getUserData()

  }

  ngOnInit() {
    this.lGrupos();
    this.Ocultar();
    
  }

  
  async participar(grupoID: number) {
    try {
      // Llama a la función del servicio para unirse al grupo
      await this.datab.insertParticipante(this.VuserID, grupoID);
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
          const grupoID = await this.datab.insertGrupo(this.Gnombre, this.Gdescr, this.Gclave, this.VuserID);

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

  getUserData(){ 
    this.datab.fetchUser(this.Vnick).subscribe({
      next: (userData: User[]) => {
          if (userData.length > 0) {
              console.log("User fetched:", userData[0]); // Access the first user object
          } else {
              console.log("No user found.");
          }
      },
      error: (error) => {
          console.error("Error fetching user:", error);
      }
    });
  }
  
  async cargaNick() {
    const exito = await this.datab.getNick();
    if (exito) {
        console.log(" ", exito);
    } else {
        console.log("NULL");
    }
  }

}
