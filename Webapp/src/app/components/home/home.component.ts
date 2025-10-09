import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
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

  showScrollButton = false;
  greenlineVisible = false;
  purplelineVisible = false;

  private scrollSubscription?: Subscription;
  private intersectionObserver?: IntersectionObserver;

  ngOnInit(): void {
    // Scroll button logika
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.showScrollButton = window.pageYOffset > 300;
      });
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
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
