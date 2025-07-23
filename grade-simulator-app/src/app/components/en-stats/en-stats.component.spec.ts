import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnStatsComponent } from './en-stats.component';

describe('EnStatsComponent', () => {
  let component: EnStatsComponent;
  let fixture: ComponentFixture<EnStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnStatsComponent]
    });
    fixture = TestBed.createComponent(EnStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
