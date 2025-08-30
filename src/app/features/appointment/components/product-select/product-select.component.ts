import {
  Component,
  signal,
  computed,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TrackByFunction
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductPickMulti} from '../../models/booking.types';

type Product = { id: string; name: string; priceSar: number; };
export interface MultiProductPick { productIds: string[]; }

@Component({
  selector: 'app-product-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss']
})
export class ProductSelectComponent implements OnChanges {
  @Input() title = 'Please Select Product';
  @Input() peopleCount = 1;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<ProductPickMulti>();
  // demo data — replace with API
  products = signal<Product[]>([
    { id: 'p1', name: 'Classic Manicure & Pedicure (Hands)', priceSar: 150 },
    { id: 'p2', name: 'Classic Manicure & pedicure Color for Hands, Color for Foots', priceSar: 195 },
    { id: 'p3', name: 'Classic Manicure + Color + Nail Art (2Fingers)', priceSar: 172 },
    { id: 'p4', name: 'RAFF Manicure & Pedicure (Hands)', priceSar: 288 },
    { id: 'p5', name: 'Manicure + French Ombré', priceSar: 180 },
    { id: 'p6', name: 'Gel Color for Hand', priceSar: 172 },
    { id: 'p7', name: 'French Tip Hands', priceSar: 80 },
    { id: 'p8', name: 'French Ombré', priceSar: 115 },
    { id: 'p9', name: 'Remove Gel Color For hands', priceSar: 60 },
    { id: 'p10', name: 'Feet & Hands Massage (30 min)', priceSar: 99 },
  ]);

  // current person tab (0-based)
  currentIndex = signal(0);

  // one selection per person (null until chosen)
  selections = signal<(string | null)[]>([null]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['peopleCount']) {
      const n = Math.max(1, Number(this.peopleCount) || 1);
      const curr = this.selections();
      const next = curr.slice(0, n);
      while (next.length < n) next.push(null);
      this.selections.set(next);
      if (this.currentIndex() >= n) this.currentIndex.set(n - 1);
    }
  }

  get persons(): number[] {
    return Array.from({ length: Math.max(1, Number(this.peopleCount) || 1) }, (_, i) => i);
  }

  select(p: Product): void {

    const i = this.currentIndex();
    const arr = this.selections().slice();
    arr[i] = arr[i] === p.id ? null : p.id; // toggle
    this.selections.set(arr);
    this.nextPerson()

  }

  selectedFor(i: number): string | null {
    return this.selections()[i];
  }

  isSelectedForCurrent(p: Product): boolean {
    return this.selectedFor(this.currentIndex()) === p.id;
  }

  allSelected = computed(() => this.selections().every(id => !!id));

  goToPerson(i: number): void { if (i >= 0 && i < this.peopleCount) this.currentIndex.set(i); }
  nextPerson(): void { const i = this.currentIndex(); if (i < this.peopleCount - 1) this.currentIndex.set(i + 1); }
  prevPerson(): void { const i = this.currentIndex(); if (i > 0) this.currentIndex.set(i - 1); }

  goBack(): void { this.back.emit(); }
  goNext(): void {
    if (!this.allSelected()) return;
    this.next.emit({ productIds: this.selections().map(id => id!) });
  }
// For products (objects)
  trackByProduct: TrackByFunction<Product> = (_: number, p: Product) => p.id;

// For people (numbers)
  trackByPerson: TrackByFunction<number> = (_: number, n: number) => n;
  trackById = (_: number, p: Product) => p.id;
}
