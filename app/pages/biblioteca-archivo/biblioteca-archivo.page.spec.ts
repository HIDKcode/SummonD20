import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliotecaArchivoPage } from './biblioteca-archivo.page';

describe('BibliotecaArchivoPage', () => {
  let component: BibliotecaArchivoPage;
  let fixture: ComponentFixture<BibliotecaArchivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaArchivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
