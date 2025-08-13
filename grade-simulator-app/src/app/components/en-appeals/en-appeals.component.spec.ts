import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnAppealsComponent } from './en-appeals.component';

describe('EnAppealsComponent', () => {
  let component: EnAppealsComponent;
  let fixture: ComponentFixture<EnAppealsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnAppealsComponent]
    });
    fixture = TestBed.createComponent(EnAppealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
