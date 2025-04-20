import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysCardComponent } from './days-card.component';

describe('DaysCardComponent', () => {
  let component: DaysCardComponent;
  let fixture: ComponentFixture<DaysCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
