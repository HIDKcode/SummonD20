import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { DatabaseService } from './database.service';



describe('DatabaseService', () => {
  let service: DatabaseService;

  
const mockDB = {
  fetchProductos: () => of([]),
  dbState: () => of([])
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: mockDB}
      ],
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
