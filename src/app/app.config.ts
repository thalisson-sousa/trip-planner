import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import MyPreset from './mypreset';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseEnv } from '../environments/environment.development';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseEnv.firebase)),
    { provide: FIREBASE_OPTIONS, useValue: firebaseEnv.firebase },
    provideAuth(() => getAuth()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: MyPreset, options: { darkModeSelector: false } },
    })
  ]
};
