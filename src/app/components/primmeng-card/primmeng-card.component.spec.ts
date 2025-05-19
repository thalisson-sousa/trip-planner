import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimmengCardComponent } from './primmeng-card.component';

describe('PrimmengCardComponent', () => {
  let component: PrimmengCardComponent;
  let fixture: ComponentFixture<PrimmengCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimmengCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimmengCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
