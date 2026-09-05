import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header
      class="relative w-full bg-white font-['Inter',sans-serif] mt-8 sm:mt-10 md:mt-12 z-50 !border-none !shadow-none"
    >
      <!-- Main Top Bar: Height 45px -->
      <div
        class="w-full h-[45px] px-6 sm:px-10 md:px-16 flex items-center justify-between"
      >
        <!-- Left: Brand Logo in Bodoni Moda Italic (Always on left) -->
        <div class="flex items-center">
          <a
            routerLink="/"
            (click)="closeMobileMenu()"
            class="font-['Bodoni_Moda',serif] italic font-semibold text-[17px] tracking-tight text-black hover:opacity-80 transition-opacity select-none cursor-pointer"
          >
            RealestateToyal
          </a>
        </div>

        <!-- Center: Desktop Navigation Links -->
        <nav
          class="hidden md:flex items-center space-x-8 lg:space-x-12 text-[13px] font-normal text-neutral-800"
        >
          <a
            routerLink="/"
            fragment="house-design"
            class="hover:text-black transition-colors cursor-pointer"
          >
            House Design
          </a>

          <a
            routerLink="/"
            fragment="inclusion-list"
            class="hover:text-black transition-colors cursor-pointer"
          >
            Inclusion List
          </a>

          <a
            routerLink="/"
            fragment="about"
            class="hover:text-black transition-colors cursor-pointer"
          >
            About
          </a>

          <a
            routerLink="/"
            fragment="contact"
            class="hover:text-black transition-colors cursor-pointer"
          >
            Get in touch
          </a>
        </nav>

        <!-- Right: Desktop Black Button -->
        <div class="hidden md:flex items-center">
          <a
            routerLink="/"
            fragment="contact"
            class="h-[32px] px-5 bg-black text-white text-[12px] font-medium flex items-center justify-center hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer select-none"
          >
            Get in touch
          </a>
        </div>

        <!-- Mobile Hamburger Button (Only visible on small screens) -->
        <div class="flex md:hidden items-center">
          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="p-2 text-black hover:text-neutral-600 focus:outline-none transition-colors cursor-pointer select-none"
            aria-label="Toggle navigation menu"
          >
            @if (!isMobileMenuOpen()) {
              <!-- Hamburger Icon when closed -->
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            } @else {
              <!-- Close (X) Icon when open -->
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div
          class="md:hidden absolute top-full left-0 right-0 w-full bg-white border-t border-neutral-100 px-6 py-4 space-y-4 shadow-xl z-50 transition-all duration-200"
        >
          <a
            routerLink="/"
            fragment="house-design"
            (click)="closeMobileMenu()"
            class="block text-[14px] text-neutral-800 hover:text-black font-medium transition-colors cursor-pointer py-1"
          >
            House Design
          </a>

          <a
            routerLink="/"
            fragment="inclusion-list"
            (click)="closeMobileMenu()"
            class="block text-[14px] text-neutral-800 hover:text-black font-medium transition-colors cursor-pointer py-1"
          >
            Inclusion List
          </a>

          <a
            routerLink="/"
            fragment="about"
            (click)="closeMobileMenu()"
            class="block text-[14px] text-neutral-800 hover:text-black font-medium transition-colors cursor-pointer py-1"
          >
            About
          </a>

          <a
            routerLink="/"
            fragment="contact"
            (click)="closeMobileMenu()"
            class="block text-[14px] text-neutral-800 hover:text-black font-medium transition-colors cursor-pointer py-1"
          >
            Get in touch
          </a>

          <!-- Mobile Get In Touch Button -->
          <div class="pt-2">
            <a
              routerLink="/"
              fragment="contact"
              (click)="closeMobileMenu()"
              class="w-full h-[36px] bg-black text-white text-[13px] font-medium flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer select-none"
            >
              Get in touch
            </a>
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
