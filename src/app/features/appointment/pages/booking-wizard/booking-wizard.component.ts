import {Component, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Product, ProductPick, ProductPickMulti, Step1Data} from '../../models/booking.types';
import {ReservationStepOneComponent} from '../../components/reservation-step-one/reservation-step-one.component';
import {ProductSelectComponent} from '../../components/product-select/product-select.component';
import {AppointmentTimeStepComponent} from '../../components/appointment-time-step/appointment-time-step.component';
import {
  PaymentSummaryStepComponent,
  SummaryItem
} from '../../components/payment-summary-step/payment-summary-step.component';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [CommonModule, ReservationStepOneComponent, ProductSelectComponent, AppointmentTimeStepComponent, PaymentSummaryStepComponent],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.scss'
})
export class BookingWizardComponent {
  step = signal<1|2|3|4>(1);

  // Optional: capture customer name elsewhere; hardcode for demo
  customerName = 'Alaa Fathi Abu khalil';

  // Catalog once for mapping (same list used in product component)
  private catalog: Product[] = [
    { id: 'p1',  name: 'Classic Manicure & Pedicure (Hands)', priceSar: 150 },
    { id: 'p2',  name: 'Classic Manicure & pedicure Color for Hands, Color for Foots', priceSar: 195 },
    { id: 'p3',  name: 'Classic Manicure + Color + Nail Art (2Fingers)', priceSar: 172 },
    { id: 'p4',  name: 'RAFF Manicure & Pedicure (Hands)', priceSar: 288 },
    { id: 'p5',  name: 'Manicure + French Ombré', priceSar: 180 },
    { id: 'p6',  name: 'Gel Color for Hand', priceSar: 172 },
    { id: 'p7',  name: 'French Tip Hands', priceSar: 80 },
    { id: 'p8',  name: 'French Ombré', priceSar: 115 },
    { id: 'p9',  name: 'Remove Gel Color For hands', priceSar: 60 },
    { id: 'p10', name: 'Feet & Hands Massage (30 min)', priceSar: 99 },
    { id: 'p11', name: 'Nail Art (4 Fingers)', priceSar: 99 },
    { id: 'p12', name: 'French Tip Feet', priceSar: 80 },
    { id: 'p13', name: 'Gel Color for Feet', priceSar: 172 },
    { id: 'p14', name: 'Gel Extensions', priceSar: 450 },
    { id: 'p15', name: 'Gel Remove', priceSar: 170 },
    { id: 'p16', name: 'Gel Refill', priceSar: 250 },
    { id: 'p17', name: 'BIABE Extensions', priceSar: 450 },
    { id: 'p18', name: 'Cut Aye Gel', priceSar: 180 },
    { id: 'p19', name: 'BIABE Color', priceSar: 180 },
    { id: 'p20', name: 'Remove Gel Color For Feet', priceSar: 60 },
    { id: 'p21', name: 'Classic Manicure (cleaning and color for Hands)', priceSar: 130 },
  ];

  step1 = signal<Step1Data | null>(null);
  step2 = signal<ProductPickMulti | null>(null);
  step3 = signal<{ dateISO: string; time: string } | null>(null);

  onStep1Next(payload: Step1Data) { this.step1.set(payload); this.step.set(2); }
  onStep2Next(pick: ProductPickMulti) { this.step2.set(pick); this.step.set(3); }
  onStep3Next(sel: { dateISO: string; time: string }) { this.step3.set(sel); this.step.set(4); }

  // Build the final summary items from productIds + catalog
  summaryItems = computed<SummaryItem[]>(() => {
    const ids = this.step2()?.productIds || [];
    return ids.map((id, idx) => {
      const prod = this.catalog.find(p => p.id === id);
      return {
        person: idx + 1,
        id,
        name: prod?.name ?? id,
        priceSar: prod?.priceSar ?? 0
      };
    });
  });

  onCancel() { this.step.set(1); this.step1.set(null); this.step2.set(null); this.step3.set(null); }

  onConfirm(payload: any) {
    console.log('PAYMENT CONFIRM', {
      ...payload,
      fullName: this.customerName,
      date: this.step3()?.dateISO,
      time: this.step3()?.time,
      items: this.summaryItems()
    });
    // TODO: call API
  }

}
