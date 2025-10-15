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

  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCartFromStorage();
    this.checkCartExpiry();
  }

  // Observable-ek komponensek számára
  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  // Kosár betöltése localStorage-ből
  private loadCartFromStorage(): void {
    try {
      const cartData = localStorage.getItem(this.CART_KEY);
      const cartItems = cartData ? JSON.parse(cartData) : [];

      // Quantity default értékek biztosítása ÉS típus konvertálás
      const processedItems: CartItem[] = cartItems.map((item: any) => ({
        id: typeof item.id === 'number' ? item.id : parseInt(item.id, 10),
        name: item.name,
        price:
          typeof item.price === 'number' ? item.price : parseFloat(item.price),
        quantity:
          typeof item.quantity === 'number'
            ? item.quantity
            : parseInt(item.quantity, 10) || 1,
      }));

      this.cartItemsSubject.next(processedItems);
      this.cartCountSubject.next(processedItems.length);
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.clearCart();
    }
  }

  // Termék hozzáadása
  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Ha már van ilyen termék, növeljük a mennyiségét
      updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Új termék hozzáadása
      updatedItems = [...currentItems, item];
    }

    this.updateCart(updatedItems);
  }

  // Termék eltávolítása
  removeFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter((item) =>
      item.id === itemId ? false : true
    );
    this.updateCart(updatedItems);
  }

  // Mennyiség frissítése
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.updateCart(updatedItems);
  }

  // Kosár teljes ára
  getCartTotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Kosár tartalmának lekérése (szinkron)
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Kosár számlálásának lekérése (szinkron)
  getCurrentCartCount(): number {
    return this.cartCountSubject.value;
  }

  // Kosár ürítése
  clearCart(): void {
    this.updateCart([]);
    localStorage.removeItem(this.CART_TIMESTAMP_KEY);
  }

  // Checkout - kosár tartalmának előkészítése fizetéshez
  prepareCheckout(): CartItem[] {
    const items = this.getCurrentCartItems();
    return items.map((item) => ({
      ...item,
      quantity: item.quantity || 1, // Backend elvárás szerint
    }));
  }

  // Kosár frissítése és mentése
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(items.length);

    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
      localStorage.setItem(this.CART_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Kosár lejárat ellenőrzése
  private checkCartExpiry(): void {
    const timestamp = localStorage.getItem(this.CART_TIMESTAMP_KEY);
    if (timestamp) {
      const now = Date.now();
      const cartTime = parseInt(timestamp, 10);

      if (now - cartTime > this.CART_EXPIRY_TIME) {
        console.log('Cart expired, clearing...');
        this.clearCart();
      }
    }
  }

  // Success page utáni törlés
  clearCartAfterSuccess(): void {
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem('cart_jp');
    localStorage.removeItem(this.CART_TIMESTAMP_KEY);
    localStorage.removeItem('clearCart');
    this.cartItemsSubject.next([]);
    this.cartCountSubject.next(0);
  }
}
