import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Image Assets in public/house-imag
  readonly heroBuilding = '/house-imag/set-new-standard.png';
  readonly houseTopLeft = '/house-imag/if-you-can-dream-it.png';
  readonly houseRight = '/house-imag/we-adapt.png';
  readonly houseBottomLeft = '/house-imag/second-we-adapt.png';
  readonly bigHouseBg = '/house-imag/bg-img.png';

  // Gallery items
  readonly galleryImages: GalleryImage[] = [
    {
      src: this.houseBottomLeft,
      alt: 'Modern Multilevel Residence',
      title: 'Modern Multilevel Residence'
    },
    {
      src: this.houseRight,
      alt: 'Illuminated Architectural House',
      title: 'Illuminated Architectural House'
    },
    {
      src: this.houseTopLeft,
      alt: 'Luxury Villa Front Entrance',
      title: 'Luxury Villa Front Entrance'
    },
    {
      src: this.bigHouseBg,
      alt: 'Contemporary Modern Villa',
      title: 'Contemporary Modern Villa'
    }
  ];

  // Gallery slider state
  readonly pairIndex = signal(0);
  readonly activeSide = signal<'left' | 'right'>('left');
  readonly selectedImageIndex = signal<number | null>(null);

  readonly currentLeftImg = computed(() => this.galleryImages[this.pairIndex() * 2]);
  readonly currentRightImg = computed(() => this.galleryImages[this.pairIndex() * 2 + 1]);
  readonly currentFocusedPhotoNumber = computed(() => {
    return this.pairIndex() * 2 + (this.activeSide() === 'left' ? 1 : 2);
  });

  readonly canGoPrev = computed(() => this.pairIndex() > 0 || this.activeSide() === 'right');
  readonly canGoNext = computed(() => {
    return (
      this.pairIndex() < Math.floor(this.galleryImages.length / 2) - 1 ||
      this.activeSide() === 'left'
    );
  });

  // Contact form state
  contactForm = {
    email: '',
    name: '',
    phone: '',
    location: ''
  };
  newsletterEmail = '';
  readonly isSubmitting = signal(false);

  // Section animation visibility states - initialized to false so CSS transition fires
  readonly isHeroVisible = signal(false);
  readonly isHouse1Visible = signal(false);
  readonly isHouse2Visible = signal(false);
  readonly isHouse3Visible = signal(false);
  readonly isSection3Visible = signal(false);
  readonly isInc1Visible = signal(false);
  readonly isInc2Visible = signal(false);
  readonly isInc3Visible = signal(false);
  readonly isAboutVisible = signal(false);
  readonly isSection6Visible = signal(false);
  readonly isContactVisible = signal(false);
  readonly isFooterVisible = signal(false);

  // Element ViewChild references
  readonly heroSectionRef = viewChild<ElementRef<HTMLElement>>('heroSectionRef');
  readonly house1Ref = viewChild<ElementRef<HTMLElement>>('house1Ref');
  readonly house2Ref = viewChild<ElementRef<HTMLElement>>('house2Ref');
  readonly house3Ref = viewChild<ElementRef<HTMLElement>>('house3Ref');
  readonly section3Ref = viewChild<ElementRef<HTMLElement>>('section3Ref');
  readonly inc1Ref = viewChild<ElementRef<HTMLElement>>('inc1Ref');
  readonly inc2Ref = viewChild<ElementRef<HTMLElement>>('inc2Ref');
  readonly inc3Ref = viewChild<ElementRef<HTMLElement>>('inc3Ref');
  readonly aboutRef = viewChild<ElementRef<HTMLElement>>('aboutRef');
  readonly section6Ref = viewChild<ElementRef<HTMLElement>>('section6Ref');
  readonly contactRef = viewChild<ElementRef<HTMLElement>>('contactRef');
  readonly footerRef = viewChild<ElementRef<HTMLElement>>('footerRef');

  private observers: IntersectionObserver[] = [];
  private keydownHandler?: (e: KeyboardEvent) => void;

  constructor(private route: ActivatedRoute) {
    // afterNextRender runs only in the browser once the DOM is fully rendered
    afterNextRender(() => {
      this.initBrowserFeatures();
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToSection(fragment), 100);
      }
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.keydownHandler) {
        window.removeEventListener('keydown', this.keydownHandler);
      }
      this.observers.forEach(obs => obs.disconnect());
      this.observers = [];
      document.body.style.overflow = '';
    }
  }

  private initBrowserFeatures(): void {
    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.keydownHandler);

    if (typeof IntersectionObserver === 'undefined') {
      this.setAllVisible();
      return;
    }

    // 1. Hero Observer (0.1 threshold)
    const heroEl = this.heroSectionRef()?.nativeElement;
    if (heroEl) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isHeroVisible.set(true);
          }
        },
        { threshold: 0.1 }
      );
      heroObserver.observe(heroEl);
      this.observers.push(heroObserver);
    } else {
      // Fallback if ref wasn't caught
      setTimeout(() => this.isHeroVisible.set(true), 50);
    }

    // 2. Section 2 & others Observer (0.15 threshold)
    const observeElement = (el: HTMLElement | undefined, setVisible: () => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      this.observers.push(obs);
    };

    observeElement(this.house1Ref()?.nativeElement, () => this.isHouse1Visible.set(true));
    observeElement(this.house2Ref()?.nativeElement, () => this.isHouse2Visible.set(true));
    observeElement(this.house3Ref()?.nativeElement, () => this.isHouse3Visible.set(true));
    observeElement(this.section3Ref()?.nativeElement, () => this.isSection3Visible.set(true));
    observeElement(this.inc1Ref()?.nativeElement, () => this.isInc1Visible.set(true));
    observeElement(this.inc2Ref()?.nativeElement, () => this.isInc2Visible.set(true));
    observeElement(this.inc3Ref()?.nativeElement, () => this.isInc3Visible.set(true));
    observeElement(this.aboutRef()?.nativeElement, () => this.isAboutVisible.set(true));
    observeElement(this.section6Ref()?.nativeElement, () => this.isSection6Visible.set(true));
    observeElement(this.contactRef()?.nativeElement, () => this.isContactVisible.set(true));
    observeElement(this.footerRef()?.nativeElement, () => this.isFooterVisible.set(true));
  }

  scrollToSection(id: string): void {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleLeftClick(): void {
    if (this.activeSide() === 'left') {
      this.openPopup(this.pairIndex() * 2);
    } else {
      this.activeSide.set('left');
    }
  }

  handleRightClick(): void {
    if (this.activeSide() === 'right') {
      this.openPopup(this.pairIndex() * 2 + 1);
    } else {
      this.activeSide.set('right');
    }
  }

  goPrev(): void {
    if (this.activeSide() === 'right') {
      this.activeSide.set('left');
    } else if (this.pairIndex() > 0) {
      this.pairIndex.update(idx => idx - 1);
      this.activeSide.set('right');
    }
  }

  goNext(): void {
    if (this.activeSide() === 'left') {
      this.activeSide.set('right');
    } else if (this.pairIndex() < Math.floor(this.galleryImages.length / 2) - 1) {
      this.pairIndex.update(idx => idx + 1);
      this.activeSide.set('left');
    }
  }

  openPopup(index: number): void {
    this.selectedImageIndex.set(index);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePopup(): void {
    this.selectedImageIndex.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  prevImage(): void {
    const current = this.selectedImageIndex();
    if (current !== null && current > 0) {
      this.selectedImageIndex.set(current - 1);
    }
  }

  nextImage(): void {
    const current = this.selectedImageIndex();
    if (current !== null && current < this.galleryImages.length - 1) {
      this.selectedImageIndex.set(current + 1);
    }
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (this.selectedImageIndex() === null) return;
    if (e.key === 'Escape') this.closePopup();
    if (e.key === 'ArrowLeft') this.prevImage();
    if (e.key === 'ArrowRight') this.nextImage();
  }

  submitContactForm(): void {
    const email = this.contactForm.email.trim();
    const name = this.contactForm.name.trim();
    const phone = this.contactForm.phone.trim();
    const location = this.contactForm.location.trim();

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 900);

    const lines = [
      `Hi Bunroeun, I would like to get in touch:`,
      `• Name: ${name || '(Not provided)'}`,
      `• Email: ${email || '(Not provided)'}`
    ];
    if (phone) lines.push(`• Phone: ${phone}`);
    if (location) lines.push(`• Location: ${location}`);

    const message = lines.join('\n');
    const telegramUrl = `https://t.me/HasBunRoeun?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(telegramUrl, '_blank');
    }
  }

  submitNewsletter(): void {
    const email = this.newsletterEmail.trim();
    if (!email) return;
    const subject = encodeURIComponent('New Newsletter Subscription - RealestateToyal');
    const body = encodeURIComponent(
      `Hi Bunroeun,\n\nI would like to subscribe to the RealestateToyal newsletter with the following email address:\n\nSubscriber Email: ${email}`
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:bunroeunhas@gmail.com?subject=${subject}&body=${body}`;
    }
  }

  private setAllVisible(): void {
    this.isHeroVisible.set(true);
    this.isHouse1Visible.set(true);
    this.isHouse2Visible.set(true);
    this.isHouse3Visible.set(true);
    this.isSection3Visible.set(true);
    this.isInc1Visible.set(true);
    this.isInc2Visible.set(true);
    this.isInc3Visible.set(true);
    this.isAboutVisible.set(true);
    this.isSection6Visible.set(true);
    this.isContactVisible.set(true);
    this.isFooterVisible.set(true);
  }
}
