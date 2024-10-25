import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
})
export class BibliotecaPage implements OnInit {

  constructor(private alerta: AlertService,
    private datab: DatabaseService,
    private menuCtrl: MenuController) {
      this.menuCtrl.enable(true);
     }

  ngOnInit() {
  }
  
}
