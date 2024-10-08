import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliotecaCrearhojaPage } from './biblioteca-crearhoja.page';

describe('BibliotecaCrearhojaPage', () => {
  let component: BibliotecaCrearhojaPage;
  let fixture: ComponentFixture<BibliotecaCrearhojaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaCrearhojaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
