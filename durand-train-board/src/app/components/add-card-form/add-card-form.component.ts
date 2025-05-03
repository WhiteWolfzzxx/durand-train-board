import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable, startWith } from 'rxjs';


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
    MatIconModule
  ],
  templateUrl: './add-card-form.component.html',
  styleUrl: './add-card-form.component.scss'
})
export class AddCardFormComponent implements OnInit {
  formGroup: FormGroup<AddCardForm>;
  engineerNameOptions: string[] = ['Jain Doe', 'James McGill', 'Walter White'];
  filteredOptions: Observable<string[]>;
  readonly roadNumbers: WritableSignal<string[]> = signal([]);

  announcer = inject(LiveAnnouncer);

  routeOptions = [
    'Ann Arbor',
    'North',
    'South',
    'East',
    'West'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      route: this.fb.control('', {nonNullable:true}),
      road: this.fb.control('', {nonNullable:true}),
      engineerName: this.fb.control('', {nonNullable:true}),
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.engineerNameOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}

class AddCardForm {
  route: FormControl<string>;
  road: FormControl<string>;
  engineerName: FormControl<string>;
  roadNumbers: FormControl<any>;
}
