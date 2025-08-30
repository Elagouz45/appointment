import {CommonModule} from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {availabilityData} from '../../models/data';

type TimeSlot = { time: string; available: number };

@Component({
  selector: 'app-appointment-time-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-time-step.component.html',
  styleUrls: ['./appointment-time-step.component.scss']
})
export class AppointmentTimeStepComponent implements AfterViewInit {
  /** how many services/people were selected in previous step */
  @Input() servicesCount = 1;
  @ViewChild('daysRow', {static: true}) daysRow!: ElementRef<HTMLDivElement>;
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<{ dateISO: string; time: string }>();

  // Calendar state
  private today = new Date();
  currentDate = signal(this.stripTime(new Date()));      // first day of current month
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  // booking-wizard.component.ts
  availabilityData = availabilityData

  // Arabic month names (RTL)
  readonly monthsAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  readonly daysArShort = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // static demo availability; replace with API based on selectedDate if needed
  baseTimeSlots: TimeSlot[] = [];

  monthLabel = computed(() => {
    const d = this.currentDate();
    return this.monthsAr[d.getMonth()];
  });
  yearLabel = computed(() => {
    const d = this.currentDate();
    return d.getFullYear();
  });

  /** build all days of the current month */
  daysOfMonth = computed(() => {
    const base = this.currentDate(); // signal or getter returning a Date
    const year = base.getFullYear();
    const month = base.getMonth();

    const last = new Date(year, month + 1, 0).getDate();
    const arr: {
      date: Date;
      label: string;
      dayName: string;
      disabled: boolean;
      selected: boolean
    }[] = [];

    const sel = this.selectedDate?.(); // handle if it's a signal
    for (let day = 1; day <= last; day++) {
      // build at noon to dodge DST jumps
      const d = new Date(year, month, day, 12, 0, 0, 0);

      const disabled = this.isBeforeToday(d);
      const selected = !!sel && this.sameDay(d, sel);

      const weekday = d.getDay(); // 0=Sun..6=Sat
      const dayName = this.daysArShort[weekday]; // assuming Sunday-first array

      arr.push({
        date: d,
        label: String(day),
        dayName,
        disabled,
        selected
      });
    }
    return arr;
  });


  /** time slots for selected date (static demo here) */
  timeSlots = computed(() => {
    // in real app, fetch by this.selectedDate()
    return this.baseTimeSlots;
  });

  canGoPrevMonth(): boolean {
    const prev = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() - 1, 1);
    // prevent navigating to months completely before current month
    return (
      prev.getFullYear() > this.today.getFullYear() ||
      (prev.getFullYear() === this.today.getFullYear() && prev.getMonth() >= this.today.getMonth())
    );
  }

  ngAfterViewInit() {
    console.log(this.daysRow.nativeElement)
    this.daysRow.nativeElement.scrollLeft = -this.daysRow.nativeElement.scrollWidth;
  }

  prevMonth(): void {
    if (!this.canGoPrevMonth()) return;
    const c = this.currentDate();
    this.currentDate.set(new Date(c.getFullYear(), c.getMonth() - 1, 1));
    // reset selection if moved to different month
    this.selectedDate.set(null);
    this.selectedTime.set(null);
  }

  nextMonth(): void {
    const c = this.currentDate();
    this.currentDate.set(new Date(c.getFullYear(), c.getMonth() + 1, 1));
    this.selectedDate.set(null);
    this.selectedTime.set(null);
  }

  dateFormat(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  chooseDate(d: Date): void {
    if (this.isBeforeToday(d)) return;
    this.selectedDate.set(this.stripTime(d));
    this.selectedTime.set(null); // reset time on date change
    console.log(d.toString())
    this.getAvailabilityTime(this.dateFormat(d))
  }

  getAvailabilityTime(day: any) {
    console.log(day)
    this.availabilityData.find(date => {
      console.log(date.date == day)
      if (date.date == day) {
        console.log(date.slots)
        return this.setAvailabilityTime(date.slots)
      }
      // return this.setAvailabilityTime([])
    })
  }

  setAvailabilityTime(slots: TimeSlot[]): void {
    this.baseTimeSlots = [];
    this.baseTimeSlots.push(...slots)
  }

  chooseTime(t: string): void {
    this.selectedTime.set(t);
  }

  slotDisabled(s: TimeSlot): boolean {
    return s.available < Math.max(1, this.servicesCount);
  }

  goBack(): void {
    this.back.emit();
  }

  goNext(): void {
    if (!this.selectedDate() || !this.selectedTime()) return;
    const iso = this.selectedDate()!.toISOString();
    this.next.emit({dateISO: iso, time: this.selectedTime()!});
  }

  // utils
  private stripTime(d: Date): Date {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  }

  private isBeforeToday(d: Date): boolean {
    const x = this.stripTime(d).getTime();
    const t = this.stripTime(this.today).getTime();
    return x < t;
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  // trackBys
  trackByDate = (_: number, v: { date: Date }) => v.date.toDateString();
  trackByTime = (_: number, v: TimeSlot) => v.time;
}
