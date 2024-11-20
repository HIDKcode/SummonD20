import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaPage } from './sala.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

const mockActiveRoute = {
  paramMap: of({ get: () => 'mocked-id' })
};

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

describe('SalaPage', () => {
  let component: SalaPage;
  let fixture: ComponentFixture<SalaPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SalaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide:ActivatedRoute, useValue: mockActiveRoute},
        {provide:DatabaseService, useValue: mockDB},
        {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
