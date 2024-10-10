import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-biblioteca-crearhoja',
  templateUrl: './biblioteca-crearhoja.page.html',
  styleUrls: ['./biblioteca-crearhoja.page.scss'],
})
export class BibliotecaCrearhojaPage implements OnInit {
  

  //variables
  num1!: number;
  num2!: number;
  num3!: number;
  num4!: number;

  Booleanpdf: boolean = false;
  ArchivoID!: number;

  constructor(private alerta: AlertService, private router: Router) { }

  ngOnInit() {
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
  
  Valida(){
      let hasE = false;

      // Validador de limite valor
      if(this.num1 == undefined || (this.num1 < 1 || this.num1 > 9)){hasE = true;}
      if(this.num2 == undefined || (this.num2 < 1 || this.num2 > 9)){hasE = true;}
      if(this.num3 == undefined || (this.num3 < 1 || this.num3 > 9)){hasE = true;}
      if(this.num4 == undefined || (this.num4 < 1 || this.num4 > 24)){hasE = true;}
      // Si hay algún error, parará aquí.
      if (hasE) {
          const titulo = "Números inválidos";
          const mensaje = "Ingrese números dentro del rango índicado";
          this.alerta.presentAlert(titulo, mensaje);
        return false;
        // Si no hay errores, continúa creando el archivo

        //Programar Creación de archivo && Programar descarga en PDF
        } else { 
          let navigationextras: NavigationExtras = {
            state:{ 
              aID: this.ArchivoID,
            }
          }
          this.router.navigate(['/biblioteca-archivo'],navigationextras);
        } 
      return true;
    }

  }
