import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  Usuario: string = "ID-invitado";
  Correo: string = "";
  

  constructor(private router: Router, private activatedroute: ActivatedRoute) {
    //realizar la captura de la informacion que viene por navigationExtras
    this.activatedroute.queryParams.subscribe(param =>{
    //validamos si viene o no información
    if(this.router.getCurrentNavigation()?.extras.state){
      //capturamos informacion
      this.Usuario = this.router.getCurrentNavigation()?.extras?.state?.['user'];
      this.Correo = this.router.getCurrentNavigation()?.extras?.state?.['mail'];

     }
    });
  }

  ngOnInit() {
  }

}
