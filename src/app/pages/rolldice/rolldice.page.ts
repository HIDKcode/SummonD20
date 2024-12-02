import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-rolldice',
  templateUrl: './rolldice.page.html',
  styleUrls: ['./rolldice.page.scss'],
})
export class RolldicePage implements OnInit {
  rolls: number[] = [];
  Vstring: string = '';
  Vresultado!: any;

  constructor(
    private menuCtrl: MenuController,
    private alerta: AlertService,
    private nativestorage: NativeStorage,
    private datab: DatabaseService
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.datab.acceso();
  }

  rolld20(){
    this.rollCustomDiceLocal('d20')
  }
  roll3d6(){
    this.rollCustomDiceLocal('3d6')
  }
  rolld100(){
    this.rollCustomDiceLocal('1d100')
  }


  rollCustomDiceLocal(diceExpression: string) {
    let results: number[] = [];
    let totalSum = 0;

    diceExpression = diceExpression.replace(/[^0-9dD+-]/g, '');

    const parts = diceExpression.split(/(?=[+-])/);

    for (const part of parts) {
      const diceMatch = part.match(/(\d*)[dD](\d+)/);
      const modifierMatch = part.match(/([+-])(\d+)/);

      if (diceMatch) {
        // Lógica para lanzar dados
        const count = diceMatch[1] ? parseInt(diceMatch[1]) : 1; 
        const faces = parseInt(diceMatch[2]); 

        for (let i = 0; i < count; i++) {
          const roll = Math.floor(Math.random() * faces) + 1;
          results.push(roll);
          totalSum += roll;
        }
      } else if (modifierMatch) {
        const sign = modifierMatch[1] === '+' ? 1 : -1; 
        const modifier = parseInt(modifierMatch[2]);
        totalSum += sign * modifier; 
      }
    }

    const finalResult = { rolls: results, total: totalSum };
    this.nativestorage.setItem('lastRoll', JSON.stringify(finalResult)).then(() => {
      this.Vresultado = finalResult;
      //this.alerta.presentAlert('Lanzamiento de dados:', `Resultados: ${results.join(', ')}. Total: ${totalSum}`);
    });
  }

  roll() {
    const regex = /^(\d*[dD]\d+)([+-]\d+)?$/;

    if (!regex.test(this.Vstring)) {
      const titulo = 'Fallo al lanzar dado.';
      const mensaje = "Formato esperado: 'D100', '2d6'";
      this.alerta.presentAlert(titulo, mensaje);
      return;
    } else {
      this.rollCustomDiceLocal(this.Vstring);
    }
  }

  getResultado() {
    this.nativestorage.getItem('lastRoll')
      .then((data: any) => {
        const parsedData = JSON.parse(data);
        this.Vresultado = parsedData.total;
        this.alerta.presentAlert('Último lanzamiento:', `Resultados: ${parsedData.rolls.join(', ')}. Total: ${parsedData.total}`);
      })
      .catch((error: any) => console.error('Error al recuperar el último lanzamiento:', error));
  }

}
