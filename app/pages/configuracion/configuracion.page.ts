import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  IDuser: string = "";
  Acceso: number = 1;

  constructor(private router: Router, private activatedroute: ActivatedRoute) {
    //realizar la captura de la informacion que viene por navigationExtras
    this.activatedroute.queryParams.subscribe(param =>{
    //validamos si viene o no información
    if(this.router.getCurrentNavigation()?.extras.state){
      //capturamos informacion
      this.IDuser = this.router.getCurrentNavigation()?.extras?.state?.['user'];
      this.Acceso = this.router.getCurrentNavigation()?.extras?.state?.['acce'];
  
     }
    });
     }

  ngOnInit() {
  }

}
