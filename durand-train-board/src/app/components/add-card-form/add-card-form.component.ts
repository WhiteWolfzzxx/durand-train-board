import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable, startWith } from 'rxjs';
import { EditEngineerFormComponent } from '../edit-engineer-form/edit-engineer-form.component';
import { EngineerService } from '../../services/engineer.service';
import { EngineerSchema } from '../../schemas/engineer.schema';


@Component({
  selector: 'app-add-card-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './add-card-form.component.html',
  styleUrl: './add-card-form.component.scss'
})
export class AddCardFormComponent implements OnInit {
  formGroup: FormGroup<AddCardForm>;
  engineerNameOptions: {name: string, id: number}[] = [];
  engineers: EngineerSchema[] = [];
  filteredOptions: Observable<{name: string, id: number}[]>;
  readonly roadNumbers: WritableSignal<string[]> = signal([]);

  announcer = inject(LiveAnnouncer);

  routeOptions = [
    'Ann Arbor',
    'North',
    'South',
    'East',
    'West'
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private engineerService: EngineerService) {}

  ngOnInit(): void {
    this.engineerService.get().subscribe(engineers => {
      this.engineers = engineers;
      this.engineerNameOptions = engineers.map(e => ({name: `${e.lastName}, ${e.firstName}`, id: e.id}));
    })

    this.formGroup = this.fb.group({
      route: this.fb.control('', {nonNullable:true}),
      road: this.fb.control('', {nonNullable:true}),
      engineerName: this.fb.control<{name: string; id: number} | string>('', {nonNullable: true}),
      roadNumbers: this.fb.control([])
    });

    this.filteredOptions = this.formGroup.controls.engineerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  removeRoadNumber(keyword: string) {
    this.roadNumbers.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords];
    });
  }

  addRoadNumber(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.roadNumbers.update(keywords => [...keywords, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  openNewEngineerForm(): void {
    const selectedEngineer = this.engineers.find(
      e => e.id === (this.formGroup.controls.engineerName.value as {name: string; id: number}).id);

    this.dialog.open(EditEngineerFormComponent, {
      height: '500px',
      width: '500px'
    });
  }

  openEditEngineerForm(): void {
    const selectedEngineer = this.engineers.find(
      e => e.id === (this.formGroup.controls.engineerName.value as {name: string; id: number}).id);

    this.dialog.open(EditEngineerFormComponent, {
      height: '500px',
      width: '500px',
      data: {
        engineer: selectedEngineer
      }
    });
  }

  displayName(engineer: {name: string; id: number}) {
    return engineer.name;
  }

  private _filter(value: string | {name: string, id: number}): {name: string; id: number}[] {
    const filterValue = (value as {name: string, id: number})?.name?.toLowerCase() ?? (value as string).toLowerCase();

    return this.engineerNameOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}

class AddCardForm {
  route: FormControl<string>;
  road: FormControl<string>;
  engineerName: FormControl<{name: string; id: number} | string>;
  roadNumbers: FormControl<any>;
}
