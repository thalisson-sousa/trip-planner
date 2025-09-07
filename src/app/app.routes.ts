import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { authGuard } from './utils/authGuard';
import { TravelsComponent } from './pages/travels/travels.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ConfigsComponent } from './components/configs/configs.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MytravelsComponent } from './components/mytravels/mytravels.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'newtrip', component: CreateTripComponent, canActivate: [authGuard]},
  {path: 'travels', component: TravelsComponent , canActivate: [authGuard]},
  {path: 'myprofile', component: MyprofileComponent, canActivate: [authGuard]},

  // Profile Page Routes
  {
  path: 'myprofile',
  component: MyprofileComponent,
  children: [
    { path: 'profile', component: ProfileComponent, outlet: 'secondary', canActivate: [authGuard]},
    { path: 'mytravels', component: MytravelsComponent, outlet: 'secondary', canActivate: [authGuard] },
    { path: 'documents', component: DocumentsComponent, outlet: 'secondary', canActivate: [authGuard] },
    { path: 'configs', component: ConfigsComponent, outlet: 'secondary', canActivate: [authGuard] }
  ]
}

];
