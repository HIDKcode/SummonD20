import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/clasesdb';
import { AlertService } from 'src/app/services/alert.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  
  VuserID!: number;
  Vnick!: string;
  Vcorreo!: string;
  Vpass: string = "";
  Vpass2: string = "";
  Vprofile!: any;
  estado: any;

  
  constructor(private router: Router, private nativeStorage: NativeStorage, private datab: DatabaseService, private alerta: AlertService, private menuCtrl: MenuController) {
    this.menuCtrl.enable(true);

    this.cargaNick();
      this.getUserData();
        this.AdminPage();
  }

  async ngOnInit() {
   
  }


 

  getUserData(){ 
    this.datab.fetchUser(this.Vnick).subscribe({
      next: (userData: User[]) => {
          if (userData.length > 0) {
              console.log("User fetched:", userData[0]); 
              try {
                const user = this.nativeStorage.getItem("userData");
                this.VuserID = userData[0].userID;
                this.Vnick = userData[0].nick;
                this.Vcorreo = userData[0].correo
                this.Vprofile = userData[0].perfil_media;
                this.estado = userData[0].estado;
              } catch (error) {
                const titulo = "GetUserData";
                const mensaje = "Error al obtener data de usuario";
                this.alerta.presentAlert(titulo, mensaje);
              }
          } else {
              console.log("No user found.");
          }
      },
      error: (error) => {
          console.error("Error fetching user:", error);
      }
    });
  }
  
  async cargaNick(){
    try {
        const userData = await this.nativeStorage.getItem('userData');
        this.Vnick = userData.nick;
        return true;
    } catch (error) {
        console.error("Error retrieving nickname from Native Storage:", error);
        return null;
    }
  }

  async AdminPage(){
    try {
      if (this.estado !== 9) {
        this.router.navigate(['/menu']);
      }
    } catch (e) {
      console.error("Error", e);
  
      this.router.navigate(['/home']);
    }
  }
 
}