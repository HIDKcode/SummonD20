import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-biblioteca-archivo',
  templateUrl: './biblioteca-archivo.page.html',
  styleUrls: ['./biblioteca-archivo.page.scss'],
})
export class BibliotecaArchivoPage implements OnInit {

  constructor(private menuCtrl: MenuController) {
    this.menuCtrl.enable(true); }

  ngOnInit() {
  }

}
