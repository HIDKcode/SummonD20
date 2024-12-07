import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async() => {
    
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: DatabaseService, useValue: mockDB},
        {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('Deberia mostrar un mensaje de error si los campos estan vacios', () => {
  component.Vnick = ''; 
  component.Vpassword = '';  
  component.Ingreso();
  expect(component.er1.nativeElement.style.display).toBe('flex');
  expect(component.er2.nativeElement.style.display).toBe('flex');
});
});