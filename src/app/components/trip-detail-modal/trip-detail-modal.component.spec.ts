import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailModalComponent } from './trip-detail-modal.component';

describe('TripDetailModalComponent', () => {
  let component: TripDetailModalComponent;
  let fixture: ComponentFixture<TripDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
