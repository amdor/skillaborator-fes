import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElabratorResultComponent } from './elabrator-result.component';

describe('ElabratorResultComponent', () => {
  let component: ElabratorResultComponent;
  let fixture: ComponentFixture<ElabratorResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElabratorResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElabratorResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
