import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalalistasPage } from './salalistas.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';

const mockDB = {
  dbState: jasmine.createSpy('dbState').and.returnValue(of(true)), // Simula un estado válido de la base de datos
  fetchmisgrupos: jasmine.createSpy('fetchmisgrupos').and.returnValue(of([])),
  fetchgrupos: jasmine.createSpy('fetchgrupos').and.returnValue(of([])),
  consultamisgrupos: jasmine.createSpy('consultamisgrupos').and.returnValue(Promise.resolve()),
  consultagrupos: jasmine.createSpy('consultagrupos').and.returnValue(Promise.resolve()),
  validaClaveGrupo: jasmine.createSpy('validaClaveGrupo').and.returnValue(Promise.resolve(true)),
  insertParticipante: jasmine.createSpy('insertParticipante').and.returnValue(Promise.resolve()),
};

const mockNativeStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve({ nick: 'testUser' })),
  setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
};

describe('SalalistasPage', () => {
  let component: SalalistasPage;
  let fixture: ComponentFixture<SalalistasPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SalalistasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide:DatabaseService, useValue: mockDB},
        {provide:NativeStorage, useValue: mockNativeStorage},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalalistasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


it('Deberia cargar nickname en Salalistas', async () => {
  await component.cargaNick();
  expect(component.Vnick).toBe('testUser');
});
});
