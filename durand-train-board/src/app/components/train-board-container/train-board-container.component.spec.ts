import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainBoardContainerComponent } from './train-board-container.component';

describe('TrainBoardContainerComponent', () => {
  let component: TrainBoardContainerComponent;
  let fixture: ComponentFixture<TrainBoardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainBoardContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainBoardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
