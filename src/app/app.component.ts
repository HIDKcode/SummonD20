import { Component } from '@angular/core';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  constructor(private router: Router, private nativestorage: NativeStorage) {
    
  }

  ngOnInit() {

  }

  irPrincipal(){
    this.router.navigate(['/menu'])
  }

  irSala(){
    this.router.navigate(['/salacreate'])
  }

  irBiblioteca(){
    this.router.navigate(['/biblioteca'])
  }

  irDados(){
    this.router.navigate(['/rolldice'])
  }

  irConfig(){
    this.router.navigate(['/configuracion'])
  }

  async Logout(){
    try {
      await this.nativestorage.remove('userData');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en Servidor: LogOut', error);
    }
  }
}
