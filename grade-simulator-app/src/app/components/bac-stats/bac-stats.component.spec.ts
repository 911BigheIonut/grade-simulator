import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacStatsComponent } from './bac-stats.component';

describe('BacStatsComponent', () => {
  let component: BacStatsComponent;
  let fixture: ComponentFixture<BacStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BacStatsComponent]
    });
    fixture = TestBed.createComponent(BacStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
