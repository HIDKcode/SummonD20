import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalachatPage } from './salachat.page';

describe('SalachatPage', () => {
  let component: SalachatPage;
  let fixture: ComponentFixture<SalachatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalachatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
