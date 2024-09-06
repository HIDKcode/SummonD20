import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolldicePage } from './rolldice.page';

describe('RolldicePage', () => {
  let component: RolldicePage;
  let fixture: ComponentFixture<RolldicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RolldicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
