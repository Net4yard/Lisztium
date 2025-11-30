import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('section3', { static: false }) section3!: ElementRef;
  @ViewChild('notesContainer', { static: false }) notesContainer!: ElementRef;

  showScrollButton = false;
  greenlineVisible = false;
  purplelineVisible = false;

  private scrollSubscription?: Subscription;
  private intersectionObserver?: IntersectionObserver;
  private noteInterval?: any;

  // Hangjegy karakterek
  private notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯', '𝄞', '𝄢'];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Scroll button logika
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.showScrollButton = window.pageYOffset > 300;
      });

    // Hangjegyek generálása időközönként
    this.startNotesAnimation();
  }

  ngAfterViewInit(): void {
    // Intersection Observer a section-3 animációkhoz
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.greenlineVisible = true;
            }, 200);
            setTimeout(() => {
              this.purplelineVisible = true;
            }, 600);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (this.section3) {
      this.intersectionObserver.observe(this.section3.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private startNotesAnimation(): void {
    this.noteInterval = setInterval(() => {
      this.createNote();
    }, 500);
  }

  private createNote(): void {
    if (!this.notesContainer) return;

    const note = this.renderer.createElement('span');
    this.renderer.addClass(note, 'note');

    // Véletlenszerű hangjegy kiválasztása
    const randomNote =
      this.notes[Math.floor(Math.random() * this.notes.length)];
    this.renderer.setProperty(note, 'textContent', randomNote);

    // Véletlenszerű stílusok beállítása
    const leftPosition = Math.random() * 100;
    const animationDuration = 2 + Math.random() * 20;
    const fontSize = 20 + Math.random() * 20;
    const rotationSpeed = Math.random() * 360;

    this.renderer.setStyle(note, 'left', `${leftPosition}vw`);
    this.renderer.setStyle(note, 'animation-duration', `${animationDuration}s`);
    this.renderer.setStyle(note, 'font-size', `${fontSize}px`);
    this.renderer.setStyle(note, 'transform', `rotate(${rotationSpeed}deg)`);

    // Hangjegy hozzáadása a container-hez
    this.renderer.appendChild(this.notesContainer.nativeElement, note);

    // Hangjegy eltávolítása animáció végén
    setTimeout(() => {
      if (note.parentNode) {
        this.renderer.removeChild(this.notesContainer.nativeElement, note);
      }
    }, 5000);
  }
}
