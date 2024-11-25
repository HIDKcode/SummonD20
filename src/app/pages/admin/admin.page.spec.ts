import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPage } from './admin.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

const mockActiveRoute = {
  subscribe: of({ get: () => 'mocked-id' })
};

const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};


describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActiveRoute}, { provide: DatabaseService, useValue: mockDB}, {provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
