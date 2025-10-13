import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

interface ScheduleDay {
  title: string;
  activities: string;
}

interface Package {
  title: string;
  price: string;
  description: string;
}

interface EventDetails {
  title: string;
  date: string;
  venue: string;
  content: string;
  description: string;
  maxParticipants: string;
  deadline: string;
  applicationInfo: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  showScrollButton = false;
  private scrollSubscription?: Subscription;

  scheduleOverview: ScheduleDay[] = [
    { title: 'Day 1:', activities: 'Opening event, masterclass' },
    { title: 'Day 2:', activities: 'Masterclass, practice' },
    {
      title: 'Day 3:',
      activities: 'Masterclass, practice, consultation on studying in Hungary',
    },
    {
      title: 'Day 4:',
      activities:
        'Masterclass, practice, rehearsal + class concert by students',
    },
    { title: 'Day 5:', activities: 'Masterclass, practice, Closing event' },
  ];

  detailedSchedule: ScheduleDay[] = [
    { title: 'Day 1:', activities: 'Opening event, masterclass' },
    { title: 'Day 2:', activities: 'Masterclass, practice' },
    {
      title: 'Day 3:',
      activities: 'Masterclass, practice, consultation on studying in Hungary',
    },
    {
      title: 'Day 4:',
      activities:
        'Masterclass, practice, rehearsal + class concert by students',
    },
    { title: 'Day 5:', activities: 'Masterclass, practice, Closing event' },
  ];

  eventDetails: EventDetails = {
    title: 'Lisztium in Kumamoto 2025',
    date: '2025 August 19th-23th',
    venue: 'Heisei College of Music, Kumamoto',
    content: 'Audition to participate at the event',
    description: `During the 5 days 3*45-minute masterclass with the professor
    The best students voted by the professors have a chance to perform at the closing concert where professors also perform.
    Optional practice at the avenue for a rental fee.
    Consultation on studying in Hungary`,
    maxParticipants: '20 persons',
    deadline: '2025 July 21st',
    applicationInfo: `Application through our webpage online.
    For fees and details please check out our application page.`,
  };

  packages: Package[] = [
    {
      title: 'Audition for Active participant',
      price: '8.000¥',
      description:
        'As there is only a limited number of students, we can accommodate there is a screening round before one can apply for the Active participant package. The option for the Active participant package will only be to those who have passed the audition.',
    },
    {
      title: 'Active participant',
      price: '60.000¥',
      description:
        'During the 5 days 3*45-minute individual masterclass with the professor.',
    },
    {
      title: 'Optional plus one class',
      price: '20.000¥',
      description:
        'Option to have one more 45 minutes individual masterclass with the professor during the 5 days.',
    },
    {
      title: 'Piano accompaniment',
      price: '15.000¥/lesson',
      description: 'Piano accompaniment option for 2*45-minute masterclass.',
    },
    {
      title: 'Optional plus one piano accompaniment',
      price: '7.500¥',
      description:
        'Option to have one more piano accompaniment for 45 minutes for the individual masterclass during the 5 days.',
    },
    {
      title: 'Passive participants standard',
      price: '20.000¥',
      description:
        'May visit all the classes during the 5 days as a passive participant.',
    },
    {
      title: 'Passive participants U25',
      price: '10.000¥',
      description:
        'May visit all the classes during the 5 days as a passive participant for ages 25 and younger.',
    },
    {
      title: 'Optional practice',
      price: '2.000¥/30 mins',
      description:
        '30-minute practice in one of the classrooms at the venue, this can be multiple times during the 5 days.',
    },
    {
      title: 'Consultation on studying in Hungary',
      price: '4.000¥',
      description:
        '45-minute consultation on the basics of studying in Hungary and on applying to the Liszt Ferenc Academy of Music',
    },
    {
      title: 'Daily ticket at the venues',
      price: '5.000¥',
      description:
        'May visit all the classes during the day as a passive participant. Same day purchase, can be paid only at the venue in cash.',
    },
    {
      title: 'Daily ticket at the venues U25',
      price: '3.000¥',
      description:
        'May visit all the classes during the day as a passive participant for ages 25 and younger. Same day purchase can be paid only at the venue in cash.',
    },
    {
      title: 'Daily ticket at the venues for parents, guardians',
      price: '1.000¥',
      description:
        'May visit all the classes during the day as a passive participant. Same day purchase can be paid only at the venue in cash.',
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
