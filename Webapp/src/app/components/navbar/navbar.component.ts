import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'; // ← Material Button import
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule], // ← MatButtonModule hozzáadva
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isMenuOpen = false;

  private cartSubscription?: Subscription;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    // Cart count figyelése
    this.cartSubscription = this.cartService
      .getCartCount()
      .subscribe((count) => {
        this.cartCount = count;
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
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
    this.closeMenu();
  }

  // Bármilyen komponensben lekérheted a totalt:
  getTotalPrice(): number {
    return this.cartService.getCartTotal();
  }
}
