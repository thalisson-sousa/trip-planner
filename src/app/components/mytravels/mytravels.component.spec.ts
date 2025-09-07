import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytravelsComponent } from './mytravels.component';

describe('MytravelsComponent', () => {
  let component: MytravelsComponent;
  let fixture: ComponentFixture<MytravelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MytravelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MytravelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
