import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TestBed } from '@angular/core/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';
import { DatabaseService } from 'src/app/services/database.service';
import { of } from 'rxjs';

describe('AppComponent', () => {

  
  const mockActiveRoute = {}

  const mockDB = {
    fetchProductos: () => of([]),
    dbState: () => of([]),
  };
  


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: mockDB}, {provide: NativeStorage},{provide: ActivatedRoute, useValue: mockActiveRoute}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
