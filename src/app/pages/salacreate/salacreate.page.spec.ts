import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalacreatePage } from './salacreate.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

describe('SalacreatePage', () => {
  let component: SalacreatePage;
  let fixture: ComponentFixture<SalacreatePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SalacreatePage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide:DatabaseService, useValue: mockDB},
        {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalacreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
