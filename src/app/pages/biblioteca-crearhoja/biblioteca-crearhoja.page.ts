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

  ArchivoID!: number;

  constructor(private alerta: AlertService, private router: Router) { }

  ngOnInit() {
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
  
  Valida(){
    
      // Validador de limite valor
      if(this.num1 > 0 && this.num1 < 9){
        
          let navigationextras: NavigationExtras = {
            state:{
              aID: this.ArchivoID,
            }
          }
          console.log("Paso2Valida")
          this.router.navigate(['/biblioteca-archivo'],navigationextras);
        } 
        else{
          const titulo = "Titulo";
          const mensaje = "Mensaje";
          this.alerta.presentAlert(titulo, mensaje);
          return;
      }
      return true;
    }//fin else

}
  

