import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboratorLobbyComponent } from './elaborator-lobby.container.component';

describe('ElaboratorLobbyComponent', () => {
  let component: ElaboratorLobbyComponent;
  let fixture: ComponentFixture<ElaboratorLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElaboratorLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboratorLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
