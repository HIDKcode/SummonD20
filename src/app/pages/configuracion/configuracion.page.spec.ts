import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracionPage } from './configuracion.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service';

const mockActiveRoute = {}

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([]),
  acceso: () => Promise.resolve(true),
};

const mockCameraService = {
  takePicture1x1: jasmine.createSpy('takePicture1x1').and.returnValue(Promise.resolve('mocked-photo-url')),
};

const mockNativeStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve({ nick: 'testUser' })),
  setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
};

describe('ConfiguracionPage', () => {
  let component: ConfiguracionPage;
  let fixture: ComponentFixture<ConfiguracionPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguracionPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CamaraService, useValue: mockCameraService },
        {provide: ActivatedRoute, useValue: mockActiveRoute},
        { provide: DatabaseService, useValue: mockDB},
        {provide:NativeStorage, useValue: mockNativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia actualizar foto de perfil al tomar una foto', async () => {
    await component.foto();
    expect(component.Vprofile).toBe('mocked-photo-url');
  });

  it('Deberia cargar nickname en Vista Configuracion', async () => {
    await component.cargaNick();
    expect(component.Vnick).toBe('testUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
