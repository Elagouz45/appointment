import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

export type SummaryItem = { person: number; id: string; name: string; priceSar: number };

@Component({
  selector: 'app-payment-summary-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-summary-step.component.html',
  styleUrls: ['./payment-summary-step.component.scss']
})
export class PaymentSummaryStepComponent {
  /* Inputs from previous steps */
  @Input() fullName = 'Guest';
  @Input() appointmentDateISO = '';
  @Input() appointmentTime = '';
  @Input() items: SummaryItem[] = [];     // one entry per person

  /* Outputs */
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{
    paymentMethod: string;
    coupon?: string;
    points?: number;
    totals: { subtotal: number; discount: number; taxableAmount: number; tax: number; total: number };
  }>();

  /* Local state */
  coupon = '';
  points = 0; // assume 1 point = 1 SAR
  paymentMethod: 'mada' | 'apple-pay' | 'visa' | 'mastercard' | '' = '';

  private readonly taxRate = 0.15; // 15%

  get subtotal(): number {
    return this.items.reduce((s, it) => s + (it.priceSar || 0), 0);
  }

  get couponDiscount(): number {
    const code = this.coupon.trim().toUpperCase();
    if (!code) return 0;
    // demo rules: SAVE10 = 10% off, SAVE20 = 20 SAR off
    if (code === 'SAVE10') return +(this.subtotal * 0.10).toFixed(3);
    if (code === 'SAVE20') return 20;
    return 0; // unknown code
  }

  get pointsDiscount(): number {
    return Math.max(0, Math.min(this.points || 0, Math.max(0, this.subtotal - this.couponDiscount)));
  }

  get discount(): number {
    return +(this.couponDiscount + this.pointsDiscount).toFixed(3);
  }

  get taxableAmount(): number {
    return +Math.max(0, this.subtotal - this.discount).toFixed(3);
  }

  get tax(): number {
    return +(this.taxableAmount * this.taxRate).toFixed(3);
  }

  get total(): number {
    return +(this.taxableAmount + this.tax).toFixed(3);
  }

  applyCoupon() { /* nothing needed, bindings recompute */
  }

  applyPoints() { /* same here */
  }

  pickMethod(m: typeof this.paymentMethod) {
    this.paymentMethod = m;
  }

  onBack() {
    this.back.emit();
  }

  onConfirm() {
    if (!this.paymentMethod) return;
    this.confirm.emit({
      paymentMethod: this.paymentMethod,
      coupon: this.coupon || undefined,
      points: this.points || undefined,
      totals: {
        subtotal: this.subtotal,
        discount: this.discount,
        taxableAmount: this.taxableAmount,
        tax: this.tax,
        total: this.total
      }
    });
  }

  formatMoney(n: number) {
    return n.toFixed(3).replace(/\.?0+$/, m => m === '.' ? '' : m);
  }
}
