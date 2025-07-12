import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { authGuard } from './utils/authGuard';
import { TravelsComponent } from './pages/travels/travels.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: SignInComponent},
  {path: 'newtrip', component: CreateTripComponent, canActivate: [authGuard]},
  {path: 'travels', component: TravelsComponent , canActivate: [authGuard]},
];
