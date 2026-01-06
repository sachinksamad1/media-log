import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Tv,
  BookOpen,
  Book,
  BookText,
  GraduationCap,
  Film,
  BarChart3,
  Settings,
  ChevronLeft,
  X,
  Gamepad2,
  MonitorDown,
} from 'lucide-angular';

interface SideMenuItem {
  icon: any;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() isCollapsed = false;

  @Output() close = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();

  readonly icons = {
    LayoutDashboard,
    Tv,
    BookOpen,
    Book,
    BookText,
    GraduationCap,
    Film,
    BarChart3,
    Settings,
    ChevronLeft,
    X,
    Gamepad2,
    MonitorDown,
  };

  readonly menuItems: SideMenuItem[] = [
    { icon: this.icons.LayoutDashboard, label: 'Dashboard', route: '/dashboard' },
    { icon: this.icons.Tv, label: 'Anime', route: '/anime' },
    { icon: this.icons.Book, label: 'Fiction', route: '/fiction' },
    { icon: this.icons.Gamepad2, label: 'Games', route: '/game' },
    { icon: this.icons.BookText, label: 'Light Novels', route: '/light-novel' },
    { icon: this.icons.BookOpen, label: 'Manga', route: '/manga' },
    { icon: this.icons.Film, label: 'Movies', route: '/movie' },
    { icon: this.icons.GraduationCap, label: 'Non-Fiction', route: '/non-fiction' },
    { icon: this.icons.MonitorDown, label: 'Tv Shows', route: '/tv-show' },
  ];

  readonly bottomItems: SideMenuItem[] = [
    { icon: this.icons.BarChart3, label: 'Analytics', route: '/analytics' },
    { icon: this.icons.BarChart3, label: 'Stats', route: '/stats' },
    { icon: this.icons.Settings, label: 'Settings', route: '/profile' },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/';
    }
    return this.router.url.startsWith(route);
  }

  onClose(): void {
    this.close.emit();
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }
}
