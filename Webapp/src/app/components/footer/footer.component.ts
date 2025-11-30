import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // ← Router import hozzáadása

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private router: Router) {}

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  scrollToEvents(): void {
    // Ha home oldalon vagyunk, scroll az Events szekcióhoz
    if (this.router.url === '/') {
      const eventsElement = document.getElementById('Events');
      if (eventsElement) {
        eventsElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Ha más oldalon vagyunk, navigálj home-ra, majd scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const eventsElement = document.getElementById('Events');
          if (eventsElement) {
            eventsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
  }
}
