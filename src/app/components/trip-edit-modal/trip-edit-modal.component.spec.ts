import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripEditModalComponent } from './trip-edit-modal.component';

describe('TripEditModalComponent', () => {
  let component: TripEditModalComponent;
  let fixture: ComponentFixture<TripEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
