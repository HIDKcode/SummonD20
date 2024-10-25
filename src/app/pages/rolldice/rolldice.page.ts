import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { dicepiService } from 'src/app/services/diceapi.service';

@Component({
  selector: 'app-rolldice',
  templateUrl: './rolldice.page.html',
  styleUrls: ['./rolldice.page.scss'],
})
export class RolldicePage implements OnInit {

  Number!: string;

  constructor(private menuCtrl: MenuController, private dice: dicepiService, private alerta: AlertService) {
    this.menuCtrl.enable(true); }

  ngOnInit() {
  }

   rollCustomDice(x: any) {
    let a = 0, b = 0, c = 0, d = 0;
    
    //Se elimin a todo excepto numeros, D/d, y +-
    x = x.replace(/[^0-9dD+-]/g, '');

    //separamos la constante donde haya signo y otorga un [] llamado dados
    const dados = x.split(/(?=[+-])/).map((part: string) => part.replace(/[+-]/g, '').trim());

    //recorremos dados
    for (const dado of dados) {
      const diceMatch = dado.match(/(\d*)[dD](\d+)/);
      
      if (diceMatch) {
        const Giros = diceMatch[1] ? parseInt(diceMatch[1]) : 1; // Si está vacío, predeterminado a 1
        const Caras = parseInt(diceMatch[2]); // El número de caras del dado
  
        // Asignar los valores a a, b, c, y d
        if (a === 0) {
          a = Caras;  // Almacenar el número de caras en a
          b = Giros; // Almacenar la cantidad en b
        } else if (c === 0) {
          c = Caras;  // Almacenar el número de caras en c
          d = Giros; // Almacenar la cantidad en d
        } else {
          const titulo = "Fallo al lanzar dado.";
        const mensaje = "Formatos esperados: '2D6', 'D100', 'nDn+nDn' o '1D100-2D6'";
        this.alerta.presentAlert(titulo, mensaje);
        return;
        }
      }
    }
  
    return { a, b, c, d }; // Retornar los resultados en formato de objeto
  }

  
}
