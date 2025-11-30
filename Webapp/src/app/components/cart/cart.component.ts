import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isProcessing = false;
  showScrollButton = false;

  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService
      .getCartItems()
      .subscribe((items) => {
        this.cartItems = items;
        this.totalPrice = this.cartService.getCartTotal();
      });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showScrollButton = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.id;
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  async proceedToCheckout(): Promise<void> {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isProcessing = true;

    try {
      const checkoutItems = this.cartService.prepareCheckout();

      const response = await fetch(
        'https://lisztium-291825688948.europe-west1.run.app/pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: checkoutItems }),
        }
      );

      const data = await response.json();

      if (data.approval_url) {
        window.location.href = data.approval_url;
      } else {
        console.error('Payment initiation failed:', data);
        alert(data.error || 'Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(
        'An error occurred while trying to proceed to payment. Please check your connection and try again.'
      );
    } finally {
      this.isProcessing = false;
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
