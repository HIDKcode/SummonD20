import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SalalistasPage } from './salalistas.page';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([]),
  ListaGrupos: () => of([]),
  ListaMisGrupos: () => of([])
};

describe('SalalistasPage', () => {
  let component: SalalistasPage;
  let fixture: ComponentFixture<SalalistasPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SalalistasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: mockDB}, {provide:NativeStorage}
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
});
