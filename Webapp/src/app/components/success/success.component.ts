import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent implements OnInit, OnDestroy {
  countdown = 5;
  private intervalId?: number;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    // Clear the cart
    this.cartService.clearCart();

    // Start countdown
    this.intervalId = window.setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.navigateToHome();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
