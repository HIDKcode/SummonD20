import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.page.html',
  styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

  //VARIABLES
  VgrupoID!: number;
  VpartId!: number;
  variable: boolean = false;

  constructor(private menuCtrl: MenuController, private activatedroute: ActivatedRoute, private datab: DatabaseService) {
    this.menuCtrl.enable(true); }

  ngOnInit() {
        // Obtener el idgrupo de los parámetros de la URL
        this.VgrupoID = Number(this.activatedroute.snapshot.paramMap.get('grupoID'));

        // Aquí puedes llamar a un servicio para obtener los detalles de la sala
        console.log('El id del grupo es: ', this.VgrupoID);
  }

  VerifParticipa(){
    //Select para obtener Participate ID

    // Si participante ID = NULL -> Retornar Salacreate
    
    // Si participante ID = NULL -> Finalizar funcion
    if(this.variable = false){
    
      
    }

  }

}

