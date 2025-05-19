import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'newtrip', component: CreateTripComponent}
];
