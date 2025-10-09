import { Component, OnInit, OnDestroy, HostListener } from '@angular/core'; // ← HostListener import
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

interface GalleryImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  showScrollButton = false;
  lightboxOpen = false;
  currentImageIndex = 0;
  currentImage: GalleryImage | null = null;

  private scrollSubscription?: Subscription;

  galleryImages: GalleryImage[] = [
    { src: 'images/DSC_4879.webp', alt: 'Pálfi Csaba - lisztium.com' },
    { src: 'images/balazs6.webp', alt: 'Dr. Réti Balázs - lisztium.com' },
    { src: 'images/IMG_5840.webp', alt: 'Pálfi Csaba - lisztium.com' },
    { src: 'images/balazs1.webp', alt: 'Dr. Réti Balázs - lisztium.com' },
    {
      src: 'images/DSC_0456-images-61.webp',
      alt: 'Pálfi Csaba - lisztium.com',
    },
    { src: 'images/IMG_5851.webp', alt: 'Pálfi Csaba - lisztium.com' },
    { src: 'images/balazs3.webp', alt: 'Dr. Réti Balázs - lisztium.com' },
    { src: 'images/Haruka_2.webp', alt: 'Nagao Haruka - lisztium.com' },
    { src: 'images/DSC_5014 1.webp', alt: 'Pálfi Csaba - lisztium.com' },
    { src: 'images/veronika1.webp', alt: 'Dr. Oross Veronika - lisztium.com' },
    { src: 'images/balazs4.webp', alt: 'Dr. Réti Balázs - lisztium.com' },
    { src: 'images/Haruka.webp', alt: 'Nagao Haruka - lisztium.com' },
    { src: 'images/balazs5.webp', alt: 'Dr. Réti Balázs - lisztium.com' },
  ];

  ngOnInit(): void {
    // Scroll button logika
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.showScrollButton = window.pageYOffset > 300;
      });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.currentImage = this.galleryImages[index];
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.lightboxOpen = false;
    this.currentImage = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  nextImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.currentImageIndex < this.galleryImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.galleryImages[this.currentImageIndex];
    }
  }

  previousImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.galleryImages[this.currentImageIndex];
    }
  }
}
