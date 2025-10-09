import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

interface Professor {
  name: string;
  route: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  showScrollButton = false;
  private scrollSubscription?: Subscription;

  professors: Professor[] = [
    {
      name: 'Dr. Balázs Réti',
      route: 'balazs',
      image: 'assets/images/balazs_portre.webp',
      description:
        'He graduated at the Ferenc Liszt Academy of Music in 1998, where his teacher was Prof. György Nádor. He got DLA degree in 2007. He is associate professor at the Liszt Music Academy, Budapest, teaching piano as a main subject. He is also the head of the Piano Department at the University of Miskolc (Béla Bartók Faculty of Music) from 2008.',
    },
    {
      name: 'Haruka Nagao',
      route: 'haruka',
      image: 'assets/images/Haruka_Portre.webp',
      description:
        "Haruka Nagao earned her bachelors, masters and doctoral degrees at the Tokyo University of the Arts, and also studied at the Graz University of Music and Performing Arts, and she has completed her viola master's program at the Liszt Music Academy, in Budapest.",
    },
    {
      name: 'Csaba Pálfi',
      route: 'csaba',
      image: 'assets/images/csaba_portre.webp',
      description:
        'Csaba Pálfi is a Hungarian clarinetist celebrated for his versatility as a soloist, chamber musician, and orchestral performer. Based in Budapest, he is a co-founder of the Weiner Ensemble and a dedicated member of the Hungarian State Opera Orchestra.',
    },
    {
      name: 'Dr. Veronika Oross',
      route: 'veronika',
      image: 'assets/images/veronikaportre.webp',
      description:
        "Dr. Veronika Oross brings virtuosic talent and dedicated mentorship to her role as Associate Professor at the prestigious Liszt Ferenc Academy of Music. A masterful flutist whose artistry has graced some of Europe's finest stages, she served as Principal Flutist with the MÁV Symphony Orchestra for 25 years.",
    },
  ];

  ngOnInit(): void {
    // Scroll button logika
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.showScrollButton = window.pageYOffset > 300;
      });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
