import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigclavePage } from './configclave.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

describe('ConfigclavePage', () => {
  let component: ConfigclavePage;
  let fixture: ComponentFixture<ConfigclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ConfigclavePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: mockDB}, {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
