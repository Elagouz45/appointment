import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryStepComponent } from './payment-summary-step.component';

describe('AppointmentListComponent', () => {
  let component: PaymentSummaryStepComponent;
  let fixture: ComponentFixture<PaymentSummaryStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSummaryStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSummaryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
