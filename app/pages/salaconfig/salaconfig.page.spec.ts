import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaconfigPage } from './salaconfig.page';

describe('SalaconfigPage', () => {
  let component: SalaconfigPage;
  let fixture: ComponentFixture<SalaconfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaconfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
