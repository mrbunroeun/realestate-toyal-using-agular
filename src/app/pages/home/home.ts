import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  signal,
  viewChild
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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

  // Section animation visibility states
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // Set all true on SSR
      this.setAllVisible();
      return;
    }

    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.keydownHandler);

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToSection(fragment), 100);
      }
    });

    setTimeout(() => {
      this.initIntersectionObservers();
    }, 50);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.keydownHandler) {
        window.removeEventListener('keydown', this.keydownHandler);
      }
      this.observers.forEach(obs => obs.disconnect());
      this.observers = [];
      document.body.style.overflow = '';
    }
  }

  scrollToSection(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
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
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closePopup(): void {
    this.selectedImageIndex.set(null);
    if (isPlatformBrowser(this.platformId)) {
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
    if (isPlatformBrowser(this.platformId)) {
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
    if (isPlatformBrowser(this.platformId)) {
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

  private initIntersectionObservers(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.setAllVisible();
      return;
    }

    const observe = (el: ElementRef<HTMLElement> | undefined, trigger: () => void) => {
      if (!el?.nativeElement) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            trigger();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el.nativeElement);
      this.observers.push(obs);
    };

    observe(this.heroSectionRef(), () => this.isHeroVisible.set(true));
    observe(this.house1Ref(), () => this.isHouse1Visible.set(true));
    observe(this.house2Ref(), () => this.isHouse2Visible.set(true));
    observe(this.house3Ref(), () => this.isHouse3Visible.set(true));
    observe(this.section3Ref(), () => this.isSection3Visible.set(true));
    observe(this.inc1Ref(), () => this.isInc1Visible.set(true));
    observe(this.inc2Ref(), () => this.isInc2Visible.set(true));
    observe(this.inc3Ref(), () => this.isInc3Visible.set(true));
    observe(this.aboutRef(), () => this.isAboutVisible.set(true));
    observe(this.section6Ref(), () => this.isSection6Visible.set(true));
    observe(this.contactRef(), () => this.isContactVisible.set(true));
    observe(this.footerRef(), () => this.isFooterVisible.set(true));
  }
}
