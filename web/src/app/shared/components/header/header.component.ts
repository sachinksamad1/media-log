import { Component, EventEmitter, Output } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  Bell,
  User,
  Menu
} from 'lucide-angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();

  onMenuClick() {
    this.menuClick.emit();
  }

  readonly icons = {
    search: Search,
    bell: Bell,
    user: User,
    menu: Menu,
  };
}
