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
  image1Url: string;
  image2Url: string;
  image3Url: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {engineer: EngineerSchema},
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEngineerFormComponent>,
    private engineerService: EngineerService) {}

  ngOnInit(): void {
    const engineer = this.data?.engineer;

    this.formGroup = this.fb.group<EditEngineerFormGroup>({
      firstName: new FormControl(engineer?.firstName ?? '', {nonNullable: true}),
      lastName: new FormControl(engineer?.lastName ?? '', {nonNullable: true}),
      image1: new FormControl(null),
      image2: new FormControl(null),
      image3: new FormControl(null)
    });

    if (!!engineer) {
      if (engineer.image1 !== null) {
        this.setImage1Url(engineer.image1);
      }
      if (engineer.image2 !== null) {
        this.setImage2Url(engineer.image2);
      }
      if (engineer.image3 !== null) {
        this.setImage3Url(engineer.image3);
      }
    }
  }

  async saveEngineer(): Promise<void> {
    const engineer = new EngineerSchema(this.data?.engineer);

    engineer.firstName = this.formGroup.controls.firstName.value;
    engineer.lastName = this.formGroup.controls.lastName.value;
    engineer.image1 = this.formGroup.controls.image1.value === null ? engineer?.image1 ?? null : new Uint8Array(await (this.formGroup.controls.image1.value as Blob).arrayBuffer());
    engineer.image2 = this.formGroup.controls.image2.value === null ? engineer?.image2 ?? null : new Uint8Array(await (this.formGroup.controls.image2.value as Blob).arrayBuffer()) ;
    engineer.image3 = this.formGroup.controls.image3.value === null ? engineer?.image3 ?? null : new Uint8Array(await (this.formGroup.controls.image3.value as Blob).arrayBuffer()) ;

    if (!engineer.id) {
      this.engineerService.add(engineer).subscribe();
    } else {
      this.engineerService.update(engineer).subscribe();
    }

    this.closeDialog();
  }

  deleteEngineer(): void {
    const engineerId = this.data.engineer.id;
    this.engineerService.delete(engineerId).subscribe(() => this.closeDialog());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getImage1Url(): any {
    return this.formGroup.controls.image1.value;
  }

  async onImage1Picked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files!.item(0);
    this.formGroup.controls.image1.setValue(file);

    this.setImage1Url(new Uint8Array(await (file as Blob).arrayBuffer()));
  }

  async onImage2Picked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files!.item(0);
    this.formGroup.controls.image2.setValue(file);

    this.setImage2Url(new Uint8Array(await (file as Blob).arrayBuffer()));
  }

  async onImage3Picked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files!.item(0);
    this.formGroup.controls.image3.setValue(file);

    this.setImage3Url(new Uint8Array(await (file as Blob).arrayBuffer()));
  }

  private setImage1Url(image: Uint8Array<ArrayBufferLike>): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.image1Url = event.target.result;
    }
    reader.readAsDataURL(new Blob([image]));
  }

  private setImage2Url(image: Uint8Array<ArrayBufferLike>): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.image2Url = event.target.result;
    }
    reader.readAsDataURL(new Blob([image]));
  }

  private setImage3Url(image: Uint8Array<ArrayBufferLike>): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.image3Url = event.target.result;
    }
    reader.readAsDataURL(new Blob([image]));
  }
}

class EditEngineerFormGroup {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  image1: FormControl<File | null>;
  image2: FormControl<Blob | null>;
  image3: FormControl<Blob | null>;
}
