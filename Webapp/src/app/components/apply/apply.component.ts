import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item'; // ← Konzisztens import
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

interface AuditionRequirement {
  title: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit, OnDestroy {
  showScrollButton = false;
  cartCount = 0;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  cartVisible = false;

  applicationForm!: FormGroup;
  private scrollSubscription?: Subscription;
  private cartSubscription?: Subscription;
  private cartItemsSubscription?: Subscription;

  instruments = ['Piano', 'Violin', 'Flute', 'Clarinet'];

  auditionRequirements: AuditionRequirement[] = [
    {
      title: 'Audition requirements for clarinet:',
      description:
        'Two freely chosen compositions/movements of different style and character (maximum duration of 20 minutes in total). Piano accompaniment is not obligatory.',
    },
    {
      title: 'Audition requirements for flute:',
      description:
        'Two freely chosen compositions/movements of different style and character (maximum duration of 20 minutes in total). Piano accompaniment is not obligatory.',
    },
    {
      title: 'Audition requirements for violin:',
      description:
        'Two freely chosen compositions/movements of different style and character (maximum duration of 20 minutes in total). Piano accompaniment is not obligatory.',
    },
    {
      title: 'Audition requirements for piano:',
      description:
        'Freely chosen piano piece or pieces with a length of 10-15 minutes',
    },
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Audition for Active participant',
      price: 8000,
      description:
        'As there is only a limited number of students, we can accommodate there is a screening round before one can apply for the Active participant package. The option for the Active participant package will only be to those who have passed the audition.',
    },
    {
      id: 2,
      name: 'Passive participants standard',
      price: 20000,
      description:
        'May visit all the classes during the 5 days as a passive participant.',
    },
    {
      id: 3,
      name: 'Passive participants U25',
      price: 10000,
      description:
        'May visit all the classes during the 5 days as a passive participant for ages 25 and younger.',
    },
  ];

  constructor(private fb: FormBuilder, private cartService: CartService) {
    this.initForm();
  }

  ngOnInit(): void {
    // Scroll button logika
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.showScrollButton = window.pageYOffset > 300;
      });

    // Cart figyelése
    this.cartSubscription = this.cartService
      .getCartCount()
      .subscribe((count) => {
        this.cartCount = count;
      });

    this.cartItemsSubscription = this.cartService
      .getCartItems()
      .subscribe((items) => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal(); // ← Itt használod!
      });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      instrument: ['', Validators.required],
      plusone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      school: [''],
      videolinks: [''],
      consent1: [false],
      consent2: [false, Validators.requiredTrue],
      consent3: [false],
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      console.log('Application submitted:', this.applicationForm.value);
      // Itt küldheted el az adatokat a backend-re
      alert('Application submitted successfully!');
      this.applicationForm.reset();
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id, // ← Number() nélkül!
      name: product.name,
      price: product.price, // ← Number() nélkül!
      quantity: 1,
    });
  }

  removeFromCart(productId: number): void {
    // ← Parameter number legyen
    this.cartService.removeFromCart(productId);
  }

  showCart(): void {
    this.cartVisible = true;
  }

  hideCart(): void {
    this.cartVisible = false;
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      const itemsForCheckout = this.cartService.prepareCheckout();
      // PayPal vagy más fizetési logika
      console.log('Checkout items:', itemsForCheckout);
      console.log('Total:', this.cartTotal); // ← És itt is!
    } else {
      alert('Your cart is empty!');
    }
  }
}
