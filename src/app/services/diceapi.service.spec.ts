import { TestBed } from '@angular/core/testing';

import { dicepiService } from './diceapi.service';

describe('dicepiService', () => {
  let service: dicepiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dicepiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
