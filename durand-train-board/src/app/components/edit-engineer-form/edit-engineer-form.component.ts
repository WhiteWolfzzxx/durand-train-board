import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EngineerSchema } from '../../schemas/engineer.schema';
import { EngineerService } from '../../services/engineer.service';

@Component({
  selector: 'app-edit-engineer-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './edit-engineer-form.component.html',
  styleUrl: './edit-engineer-form.component.scss'
})
export class EditEngineerFormComponent implements OnInit {
  formGroup: FormGroup<EditEngineerFormGroup>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {engineer: EngineerSchema},
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEngineerFormComponent>,
    private engineerService: EngineerService) {}

  ngOnInit(): void {
    const engineer = this.data?.engineer;

    this.formGroup = this.fb.group<EditEngineerFormGroup>({
      firstName: new FormControl(engineer?.firstName ?? '', {nonNullable: true}),
      lastName: new FormControl(engineer?.lastName ?? '', {nonNullable: true}),
      image1: new FormControl(engineer?.image1),
      image2: new FormControl(engineer?.image2),
      image3: new FormControl(engineer?.image3)
    });
  }

  saveEngineer(): void {
    const engineer = new EngineerSchema(this.data?.engineer);

    engineer.firstName = this.formGroup.controls.firstName.value;
    engineer.lastName = this.formGroup.controls.lastName.value;
    engineer.image1 = this.formGroup.controls.image1.value;
    engineer.image2 = this.formGroup.controls.image2.value;
    engineer.image3 = this.formGroup.controls.image3.value;

    if (!engineer.id) {
      this.engineerService.add(engineer);
    } else {
      console.error('Edit existing not implemented')
    }

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

class EditEngineerFormGroup {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  image1: FormControl<Blob | null>;
  image2: FormControl<Blob | null>;
  image3: FormControl<Blob | null>;
}
