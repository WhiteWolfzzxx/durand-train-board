import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailroadCardComponent } from './railroad-card.component';

describe('RailroadCardComponent', () => {
  let component: RailroadCardComponent;
  let fixture: ComponentFixture<RailroadCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RailroadCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailroadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
