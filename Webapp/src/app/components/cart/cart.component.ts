import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
// import { PaymentService } from '../../services/payment.service';
import { CartItem } from '../../models/cart-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isProcessing = false;
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    //private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService
      .getCartItems()
      .subscribe((items) => {
        this.cartItems = items;
        this.calculateTotal();
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  trackByCartItem(index: number, item: CartItem): string {
    return item.id;
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  private calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  async proceedToCheckout(): Promise<void> {
    if (this.cartItems.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // //const paymentUrl = await this.paymentService.createPayment(
      //   this.cartItems
      // );
      // Átirányítás PayPal-hoz
      //window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      this.isProcessing = false;
    }
  }
}
