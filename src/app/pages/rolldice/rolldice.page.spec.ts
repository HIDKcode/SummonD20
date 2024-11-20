import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolldicePage } from './rolldice.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('RolldicePage', () => {
  let component: RolldicePage;
  let fixture: ComponentFixture<RolldicePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RolldicePage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide:HttpClient},{provide:NativeStorage}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolldicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
