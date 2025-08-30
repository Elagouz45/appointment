import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationStepOneComponent } from './reservation-step-one.component';

describe('AppointmentListComponent', () => {
  let component: ReservationStepOneComponent;
  let fixture: ComponentFixture<ReservationStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationStepOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
