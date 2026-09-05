import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  readonly title = 'RealestateToyal';
  readonly showScrollTop = signal(false);
  private scrollListener?: () => void;

  constructor() {
    afterNextRender(() => {
      this.scrollListener = () => {
        this.showScrollTop.set(window.scrollY > 300);
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
