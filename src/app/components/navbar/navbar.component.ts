import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

import { MenuItem } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';

import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, AvatarGroupModule, RouterLink, SpeedDial, Chip],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items: MenuItem[] = [];

  imageUrl: string = 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png';
  userName: string = '';

 constructor(private route: Router) {

 }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const photo = localStorage.getItem('userPhoto');
      const name = localStorage.getItem('userName');
      if (photo) this.imageUrl = photo;
      if (name) this.userName = name;
    }

    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        this.items = [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    this.route.navigate(['/profile']);
                }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    localStorage.clear();
                    this.route.navigate(['/']).then(() => {
                        window.location.reload(); // Recarrega a página para aplicar as mudanças
                    }
                  );
                }
            },
        ];
    } else if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        this.items = [
            {
                label: 'Login',
                icon: 'pi pi-sign-in',
                command: () => {
                    this.route.navigate(['/login']);
                }
            }
        ];
    }
  }
}
