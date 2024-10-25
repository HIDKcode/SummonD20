import { Component } from '@angular/core';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  Vnick: string = "";

  constructor(private router: Router, private activatedroute: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.Vnick = navigation.extras.state['Vnick'];
   }
  }

  ngOnInit() {
  }


  irPrincipal(){
    let navigationExtras: NavigationExtras = {
      state: {
        Vnick: this.Vnick
      }
    }
    this.router.navigate(['/menu'],navigationExtras)
  }

  irSala(){
    let navigationExtras: NavigationExtras = {
      state: {
        Vnick: this.Vnick
      }
    }
    this.router.navigate(['/salacreate'],navigationExtras)
  }

  irBiblioteca(){
    let navigationExtras: NavigationExtras = {
      state: {
        Vnick: this.Vnick
      }
    }
    this.router.navigate(['/biblioteca'],navigationExtras)
  }

  irDados(){
    let navigationExtras: NavigationExtras = {
      state: {
        Vnick: this.Vnick
      }
    }
    this.router.navigate(['/rolldice'],navigationExtras)
  }

  irConfig(){
    let navigationExtras: NavigationExtras = {
      state: {
        Vnick: this.Vnick
      }
    }
    this.router.navigate(['/configuracion'],navigationExtras)
  }

}
