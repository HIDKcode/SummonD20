import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-salachat',
  templateUrl: './salachat.page.html',
  styleUrls: ['./salachat.page.scss'],
})
export class SalachatPage implements OnInit {

  constructor(private menuCtrl: MenuController) {
    this.menuCtrl.enable(true);}

  ngOnInit() {
  }

}
