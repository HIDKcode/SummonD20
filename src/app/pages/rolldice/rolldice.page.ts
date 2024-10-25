import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-rolldice',
  templateUrl: './rolldice.page.html',
  styleUrls: ['./rolldice.page.scss'],
})
export class RolldicePage implements OnInit {

  constructor(private menuCtrl: MenuController) {
    this.menuCtrl.enable(true); }

  ngOnInit() {
  }

}
