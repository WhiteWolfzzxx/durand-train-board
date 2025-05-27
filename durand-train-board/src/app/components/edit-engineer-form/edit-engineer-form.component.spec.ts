import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEngineerFormComponent } from './edit-engineer-form.component';

describe('EditEngineerFormComponent', () => {
  let component: EditEngineerFormComponent;
  let fixture: ComponentFixture<EditEngineerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEngineerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEngineerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
