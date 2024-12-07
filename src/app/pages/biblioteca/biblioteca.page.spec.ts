import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliotecaPage } from './biblioteca.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { CamaraService } from 'src/app/services/camara.service';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

const mockCameraService = {
  takePictureFree: jasmine.createSpy('takePictureFree').and.returnValue(Promise.resolve(new Blob(['fake-image-data'], { type: 'image/jpeg' }))
),
};

const mockNativeStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve({ nick: 'testUser' })),
  setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
};

describe('BibliotecaPage', () => {
  let component: BibliotecaPage;
  let fixture: ComponentFixture<BibliotecaPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [BibliotecaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CamaraService, useValue: mockCameraService },
        { provide: DatabaseService, useValue: mockDB},
        {provide:NativeStorage, useValue: mockNativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BibliotecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia cargar nickname en Vista Biblioteca', async () => {
    await component.cargaNick();
    expect(component.Vnick).toBe('testUser');
  });

  it('Deberia subir un archivo en biblioteca', async () => {
    await component.subirfoto();
    expect(component.Varchivo).toEqual(jasmine.any(Blob));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
