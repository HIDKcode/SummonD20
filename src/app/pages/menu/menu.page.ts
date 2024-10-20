import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  IDuser: string = "";
  Acceso: number = 1;

  constructor(private router: Router, private activatedroute: ActivatedRoute) {
 
   }

  ngOnInit() {
  }

}
