import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPage } from './menu.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';


const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};
const mockNativeStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve({ nick: 'testUser' })),
  setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
};

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [MenuPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: mockDB},
        {provide:NativeStorage, useValue: mockNativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    
    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia cargar nickname en Vista Menu', async () => {
    await component.cargaNick();
    expect(component.Vnick).toBe('testUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
