import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolldicePage } from './rolldice.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([]),
  acceso: () => Promise.resolve(true),
};

describe('RolldicePage', () => {
  let component: RolldicePage;
  let fixture: ComponentFixture<RolldicePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RolldicePage],
      imports: [IonicModule.forRoot()],
      providers: [
      {provide:DatabaseService, useValue: mockDB},
      {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolldicePage);
    component = fixture.componentInstance;

    component.Vresultado = { total: 0, rolls: [] };

    fixture.detectChanges();
  });
  
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
