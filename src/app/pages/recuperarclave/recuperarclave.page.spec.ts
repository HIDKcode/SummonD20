import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarclavePage } from './recuperarclave.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute, Router } from '@angular/router';

const mockActiveRoute = {
  queryParams: of({}),
};

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([]),
  modificaClave: (pass: string, nick: string) => Promise.resolve(true),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  getCurrentNavigation: () => ({
    extras: { state: { Vnick: 'mocked-nick' } },
  }),
};

describe('RecuperarclavePage', () => {
  let component: RecuperarclavePage;
  let fixture: ComponentFixture<RecuperarclavePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarclavePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActiveRoute },
        { provide: DatabaseService, useValue: mockDB },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
