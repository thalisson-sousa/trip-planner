import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { FullCalendarModule } from '@fullcalendar/angular';

export interface Passeio {
  id: number;
  nome: string;
  data: string;    // formato: "2025-09-15T10:00:00"
  horario: string; // "10:00"
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [FullCalendarModule],
})
export class CalendarComponent implements OnInit {
  @Input() passeios: Passeio[] = [];

  calendarOptions!: CalendarOptions;

  ngOnInit(): void {
  // pegar a menor data dos passeios (mais próxima no futuro/passado)
    const firstDate = this.passeios.length > 0
      ? new Date(Math.min(...this.passeios.map(p => new Date(p.data).getTime())))
      : new Date(); // fallback: hoje se não houver passeios

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      initialDate: firstDate, // 👈 aqui está a mágica
      locale: 'pt-br',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      events: this.passeios.map(p => ({
    id: p.id.toString(),
    title: `${p.nome}`,
    start: p.data,
  })),
  eventContent: (arg) => {
    return {
      html: `
        <div style="white-space: normal; font-size: 0.8rem; line-height: 1.2;">
          <strong>${arg.event.title}</strong><br>
          <small>${arg.event.start?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
        </div>
      `
    }
  }
    };
  }
}
