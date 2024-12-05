import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';
import { RollDiceService } from 'src/app/services/roll-dice.service';

@Component({
  selector: 'app-rolldice',
  templateUrl: './rolldice.page.html',
  styleUrls: ['./rolldice.page.scss'],
})
export class RolldicePage implements OnInit {

  Vstring: string = '';
  Vresultado!: any;

  constructor(
    private menuCtrl: MenuController,
    private alerta: AlertService,
    private datab: DatabaseService,
    private rolldice: RollDiceService
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.datab.acceso();
  }

  async rolld20(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('d20')
    this.Vresultado = RESULTADO;
  }
  async roll3d6(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('3d6')
    this.Vresultado = RESULTADO;
  }
  async rolld100(){
    const RESULTADO = await this.rolldice.rollCustomDiceLocal('1d100')
    this.Vresultado = RESULTADO;
  }

  async roll() {
    const regex = /^(\d*[dD]\d+)([+-]\d+)?$/;

    if (!regex.test(this.Vstring)) {
      const titulo = 'Fallo al lanzar dado.';
      const mensaje = "Formato esperado: 'D100', '2d6'";
      this.alerta.presentAlert(titulo, mensaje);
      return;
    } else {
      const RESULTADO = await this.rolldice.rollCustomDiceLocal(this.Vstring);
      this.Vresultado = RESULTADO;
    }
  }

}
