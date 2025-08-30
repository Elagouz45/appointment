import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

type TimeSlot = { time: string; available: number };

type DayCell = {
  date: Date;
  inMonth: boolean;
  isPast: boolean;
  isSelected: boolean;
};

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './appointment-list.component.html',
  styleUrl:'./appointment-list.component.scss'
})
export class AppointmentListComponent {

  private today = new Date();
  cards = [
    {
      title: 'Book an appointment',
      path: '/appointments/book',
      svgPath: `
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="12" y1="14" x2="12" y2="18"/>
        <line x1="10" y1="16" x2="14" y2="16"/>
      `
    },
    {
      title: 'View My Reservations',
      path: '/appointments/book',
      svgPath: `
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <rect x="7" y="12" width="3" height="3"/>
        <rect x="14" y="12" width="3" height="3"/>
        <rect x="7" y="16" width="3" height="3"/>
        <rect x="14" y="16" width="3" height="3"/>
      `
    },
    {
      title: 'Buy a gift',
      path: '/appointments/book',
      svgPath: `
        <polyline points="20,12 20,22 4,22 4,12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="m5,7 C5,7 5,4.5 8,4.5 s4,2.5 4,2.5"/>
        <path d="m19,7 C19,7 19,4.5 16,4.5 S12,7 12,7"/>
      `
    },
    {
      title: 'Redeem a gift',
      path: '/appointments/book',
      svgPath: `
        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm2 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        <path d="M12 14v2"/>
        <path d="M7 21h10"/>
      `
    }
  ];


  constructor() {

  }

}
