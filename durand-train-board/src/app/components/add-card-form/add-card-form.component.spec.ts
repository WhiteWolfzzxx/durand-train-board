import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardFormComponent } from './add-card-form.component';

describe('AddCardFormComponent', () => {
  let component: AddCardFormComponent;
  let fixture: ComponentFixture<AddCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
