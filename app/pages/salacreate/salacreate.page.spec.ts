import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalacreatePage } from './salacreate.page';

describe('SalacreatePage', () => {
  let component: SalacreatePage;
  let fixture: ComponentFixture<SalacreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalacreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
