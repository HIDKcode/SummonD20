import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalacreatePage } from './salacreate.page';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertService } from 'src/app/services/alert.service';
import { MenuController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockAlertService = {
  presentAlert: jasmine.createSpy('presentAlert'),
};

const mockDatabaseService = {
  acceso: jasmine.createSpy('acceso').and.returnValue(Promise.resolve()),
  insertGrupo: jasmine.createSpy('insertGrupo').and.returnValue(Promise.resolve()),
};

const mockNativeStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve({ nick: 'testUser' })),
};

const mockMenuController = {
  enable: jasmine.createSpy('enable'),
};

describe('SalacreatePage', () => {
  let component: SalacreatePage;
  let fixture: ComponentFixture<SalacreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalacreatePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AlertService, useValue: mockAlertService },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: MenuController, useValue: mockMenuController },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalacreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería cargar el nickname del usuario para asignacion', async () => {
    await component.cargaNick();
    expect(component.Vnick).toBe('testUser');
  });

  it('Debería crear una sala correctamente cuando los datos son válidos', async () => {
    component.nombre = 'Sala Test';
    component.descr = 'Descripción de la sala';
    component.clave = 123456;

    const result = await component.Valida();
    expect(result).toBeTrue();
    expect(mockDatabaseService.insertGrupo).toHaveBeenCalledWith('Sala Test', 'Descripción de la sala', 123456, 'testUser');
  });

  it('Debería mostrar un mensaje de alerta cuando los datos son inválidos', async () => {
    component.nombre = '';
    component.descr = 'Descripción de la sala';
    component.clave = 123456;

    const result = await component.Valida();
    expect(result).toBeFalse();
    expect(mockAlertService.presentAlert).toHaveBeenCalledWith('Datos invalidos', 'Reintente por favor');
  });

});