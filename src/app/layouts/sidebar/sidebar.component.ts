import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';

export type Page = 'reservation' | 'gift-cards' | 'profile';
@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() activePage: Page = 'reservation';
  @Input() open = false;
  @Output() pageChange = new EventEmitter<Page>();
  @Output() toggleSidebar = new EventEmitter<void>();

  onNavClick(ev: Event, page: Page) {
    ev.preventDefault();
    this.pageChange.emit(page);
  }
}
