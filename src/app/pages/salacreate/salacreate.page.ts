import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-salacreate',
  templateUrl: './salacreate.page.html',
  styleUrls: ['./salacreate.page.scss'],
})
export class SalacreatePage implements OnInit {

  Gnombre: string = "";
  Gdescr: string = "";
  Gclave!: number;

  constructor(private alerta: AlertService, private router: Router) { }

  ngOnInit() {
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
        this.router.navigate(['/biblioteca-archivo'],navigationextras);
      } 
    return true;
  }

}
