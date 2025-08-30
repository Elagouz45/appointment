import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {Step1Data} from '../../models/booking.types';

@Component({
  selector: 'app-reservation-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-step-one.component.html',
  styleUrls: ['./reservation-step-one.component.scss']
})
export class ReservationStepOneComponent {
  @Output() nextStep = new EventEmitter<Step1Data>();
  @Output() cancelFlow = new EventEmitter<void>();

  // Options
  branches = [
    { value: 'almugharizat', label: 'Al Mugharizat' },
    { value: 'alqasr',       label: 'Al Qasr' },
    { value: 'riyadh-front', label: 'Riyadh Front' },
  ];
  people = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1, label: `${i + 1} ${i === 0 ? 'Person' : 'People'}`
  }));

  loading = signal(false);

  form

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      branch: ['almugharizat', Validators.required],
      people: [2, [Validators.required, Validators.min(1)]],
    });
  }

  next() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.value as Step1Data;
    this.loading.set(false);
    this.nextStep.emit(payload);
  }

  cancel() { this.cancelFlow.emit(); }
}
