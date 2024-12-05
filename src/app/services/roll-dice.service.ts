import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RollDiceService {

  rolls: number[] = [];
  //Vstring: string = '';
  Vresultado!: any;

  constructor(){ }
  
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
    this.Vresultado = finalResult;
    return this.Vresultado;
    //this.alerta.presentAlert('Lanzamiento de dados:', `Resultados: ${results.join(', ')}. Total: ${totalSum}`);
  }
  
}

