import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  
  Vnick: string = "";

  arregloUser: any = [{
    userID: '', 
    nick: '',                    
    correo: '',         
    perfil_media: '', 
    }
  ]

  constructor(private router: Router, private activatedroute: ActivatedRoute, private datab: DatabaseService) {
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.Vnick = navigation.extras.state['Vnick'];
   }
  }

}
