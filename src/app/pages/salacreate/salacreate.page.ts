import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-salacreate',
  templateUrl: './salacreate.page.html',
  styleUrls: ['./salacreate.page.scss'],
})
export class SalacreatePage implements OnInit {


  grupos: any[] = []; 
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
    private menuCtrl: MenuController){
    this.menuCtrl.enable(true); 
      
  }

  ngOnInit() {
    this.Ocultar();
  }

  Valida(){
    let hasE = false;

    // Validador de limite valor
    if(this.Gnombre == "" ){hasE = true;}
    if(this.Gdescr == "" ){hasE = true;}
    if(this.Gclave < 0){hasE = true;}

    // Si hay algún error, parará aquí.
    if (hasE) {
        const titulo = "Datos invalidos";
        const mensaje = "Reintente por favor";
        this.alerta.presentAlert(titulo, mensaje);
      return false;
      // Si no hay errores, continúa creando el archivo
      //Programar Creación de archivo && Programar descarga en PDF
      } else { 
        let navigationextras: NavigationExtras = {
          state:{ 

          }
        }
        this.irSala(this.VgrupoID);
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

  irSala(x: any) {
    this.router.navigate(['/sala', x]);
  }
}
