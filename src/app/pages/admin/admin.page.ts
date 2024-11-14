import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertService } from 'src/app/services/alert.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  arregloUsuario : any = [{
    userID: '',
    nick: '',
    correo: '',
    perfil_media: '',
    estado: ''
  }
  ]

  Vid!: any;
  estado!: any;
  
  constructor(private router: Router, private nativeStorage: NativeStorage,
     private datab: DatabaseService, private alerta: AlertService,
      private menuCtrl: MenuController, private activatedroute: ActivatedRoute) {
    this.menuCtrl.enable(true);
    
    this.activatedroute.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Vid = this.router.getCurrentNavigation()?.extras?.state?.['Vid'];
        this.estado = this.router.getCurrentNavigation()?.extras?.state?.['estado'];
      }
    });

  }

  async ngOnInit() {
    await this.AdminPage();
    this.listarUser()
  }

  listarUser() {
    this.datab.ListaUsers().subscribe({
      next: (usuario) => {
        this.arregloUsuario = usuario;
      },
      error: (e) => {
        const em = e.message
        this.alerta.presentAlert("Error al cargar los usuarios:", "" + em);
      },
      complete: () => {
        console.log('Carga de usuarios completada.');
      }
    });
  }

  AdminPage(){
    try {
      if (this.estado !== 9) {
        this.router.navigate(['/menu']);
      }
    } catch (e) {
      this.alerta.presentAlert("Error", ""+e);
      this.router.navigate(['/menu']);
    }
  }
 
}