import { Component } from '@angular/core';
import { Trip } from '../../types/Trip';
import { TravelService } from '../../services/travel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mytravels',
  imports: [CommonModule],
  templateUrl: './mytravels.component.html',
  styleUrl: './mytravels.component.scss'
})
export class MytravelsComponent {
  trips: Trip[] = [];

    constructor(private service: TravelService) {}

    ngOnInit() {
      this.getTravels();
    }

    getTravels() {
      this.service.getTravels().subscribe((trips: Trip[]) => {
        this.trips = trips;
      });
    }

}
