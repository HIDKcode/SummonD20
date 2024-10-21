import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  
  Vnick: string = "Nick";

  constructor(private router: Router, private activatedroute: ActivatedRoute) {
    
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.Vnick = navigation.extras.state['Vnick'];
   }
  }


}
