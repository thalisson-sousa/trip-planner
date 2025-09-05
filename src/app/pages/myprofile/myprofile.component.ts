import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { Tabs, Tab } from 'primeng/tabs';
import { Avatar } from "primeng/avatar";

@Component({
  selector: 'app-myprofile',
  imports: [PanelModule, CardModule, TabsModule, CommonModule, RouterModule, Avatar, Tabs, Tab],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.scss'
})
export class MyprofileComponent {

  imageUrl: string = localStorage.getItem('userPhoto') ?? 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png';
  userName: string = localStorage.getItem('userName') ?? 'Mario';

  tabs = [
    { route: 'profile', label: 'Perfil', icon: 'pi pi-user' },
    { route: 'preferences', label: 'Preferências', icon: 'pi pi-heart' },
    { route: 'documents', label: 'Documentos', icon: 'pi pi-file' },
    { route: 'configs', label: 'Configurações', icon: 'pi pi-cog' }
  ];

  trackByRoute(index: number, tab: any): string {
  return tab.route;
}

}
