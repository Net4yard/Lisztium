import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_KEY = 'cart';
  private readonly CART_TIMESTAMP_KEY = 'cartTimestamp';
  private readonly CART_EXPIRY_TIME = 10 * 60 * 1000; // 10 perc

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.initializeCart();
  }

  private initializeCart(): void {
    // Ellenőrizzük, hogy lejárt-e a kosár
    this.checkCartExpiry();

    // Betöltjük a kosár tartalmát
    const cartItems = this.getCartFromStorage();
    this.cartItemsSubject.next(cartItems);
    this.updateCartCount();
  }

  private checkCartExpiry(): void {
    const cartTimestamp = localStorage.getItem(this.CART_TIMESTAMP_KEY);
    if (cartTimestamp) {
      const now = Date.now();
      if (now - parseInt(cartTimestamp, 10) > this.CART_EXPIRY_TIME) {
        this.clearCart();
      }
    }
  }

  private getCartFromStorage(): CartItem[] {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
      localStorage.setItem(this.CART_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private updateCartCount(): void {
    const cartItems = this.cartItemsSubject.value;
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.cartCountSubject.next(totalQuantity);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCartCount(): Observable<number> {
    return this.cartCount$;
  }

  addToCart(
    id: string,
    name: string,
    price: number,
    quantity: number = 1
  ): void {
    const currentItems = this.cartItemsSubject.value;

    // Ellenőrizzük, hogy már van-e ilyen termék
    const existingItemIndex = currentItems.findIndex((item) => item.id === id);

    if (existingItemIndex > -1) {
      // Ha már van, növeljük a mennyiségét
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Ha nincs, hozzáadjuk újként
      currentItems.push({ id, name, price, quantity });
    }

    this.saveCartToStorage(currentItems);
    this.cartItemsSubject.next([...currentItems]);
    this.updateCartCount();
  }

  removeFromCart(id: string): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter((item) => item.id !== id);

    this.saveCartToStorage(filteredItems);
    this.cartItemsSubject.next(filteredItems);
    this.updateCartCount();
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex((item) => item.id === id);

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.saveCartToStorage(currentItems);
      this.cartItemsSubject.next([...currentItems]);
      this.updateCartCount();
    }
  }

  getTotalPrice(): number {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem(this.CART_TIMESTAMP_KEY);
    this.cartItemsSubject.next([]);
    this.updateCartCount();
  }

  getCartItemsForCheckout(): CartItem[] {
    return this.cartItemsSubject.value.map((item) => ({
      ...item,
      quantity: item.quantity || 1, // Biztosítjuk, hogy minden terméknek legyen quantity-je
    }));
  }
}
