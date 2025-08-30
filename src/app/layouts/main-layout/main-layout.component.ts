import {Component, signal} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {Page, SidebarComponent} from '../sidebar/sidebar.component';
import {FooterComponent} from '../footer/footer.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  activePage = signal<Page>('reservation');
  sidebarOpen = signal(false);

  onPageChange(page: Page) {
    this.activePage.set(page);
    // Close sidebar on mobile when navigating
    this.sidebarOpen.set(false);
  }
}
