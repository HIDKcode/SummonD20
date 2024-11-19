import { TestBed } from '@angular/core/testing';

import { MailjsService } from './mailjs.service';

describe('MailjsService', () => {
  let service: MailjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
