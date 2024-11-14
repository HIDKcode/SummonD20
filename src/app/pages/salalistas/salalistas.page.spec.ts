import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalalistasPage } from './salalistas.page';

describe('SalalistasPage', () => {
  let component: SalalistasPage;
  let fixture: ComponentFixture<SalalistasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalalistasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
