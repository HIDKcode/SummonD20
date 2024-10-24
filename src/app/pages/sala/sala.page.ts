import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.page.html',
  styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

  //VARIABLES

  VpartId!: number;
  variable: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  VerifParticipa(){
    //Select para obtener Participate ID

    // Si participante ID = NULL -> Retornar Salacreate

    // Si participante ID = NULL -> Finalizar funcion
    if(this.variable = false){
    
      
    }

  }

}

