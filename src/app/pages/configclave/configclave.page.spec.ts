import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigclavePage } from './configclave.page';

describe('ConfigclavePage', () => {
  let component: ConfigclavePage;
  let fixture: ComponentFixture<ConfigclavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
