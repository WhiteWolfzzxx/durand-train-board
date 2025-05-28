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
import { RailroadCardsService } from '../../services/railroad-cards.service';
import { Card } from '../../models/card';


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
  image1Url: string;
  image2Url: string;
  image3Url: string;

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
    private engineerService: EngineerService,
    private cardsService: RailroadCardsService) {}

  ngOnInit(): void {
    this.engineerService.get().subscribe(engineers => {
      this.engineers = engineers;
      this.engineerNameOptions = engineers.map(e => ({name: `${e.lastName}, ${e.firstName}`, id: e.id}));
    })

    this.formGroup = this.fb.group({
      route: this.fb.control('', {nonNullable:true}),
      road: this.fb.control('', {nonNullable:true}),
      engineerName: this.fb.control<{name: string; id: number} | string>('', {nonNullable: true}),
      roadNumbers: this.fb.control([]),
      image: this.fb.control<string | null>(null)
    });

    this.filteredOptions = this.formGroup.controls.engineerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.formGroup.controls.engineerName.valueChanges.subscribe(e => {
      const selectedEngineer = (e as {name: string; id: number});
      if (!!selectedEngineer.id) {
        const engineer = this.engineers.find(en => en.id === selectedEngineer.id);
        this.setImage1Url(engineer?.image1 as Uint8Array<ArrayBufferLike>);
        this.setImage2Url(engineer?.image2 as Uint8Array<ArrayBufferLike>);
        this.setImage3Url(engineer?.image3 as Uint8Array<ArrayBufferLike>);
      }
    })
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
    this.dialog.open(EditEngineerFormComponent, {
      height: '800px',
      width: '800px'
    });
  }

  openEditEngineerForm(): void {
    const selectedEngineer = this.engineers.find(
      e => e.id === (this.formGroup.controls.engineerName.value as {name: string; id: number}).id);

    this.dialog.open(EditEngineerFormComponent, {
      height: '800px',
      width: '800px',
      data: {
        engineer: selectedEngineer
      }
    });
  }

  displayName(engineer: {name: string; id: number}) {
    return engineer.name;
  }

  addCard(): void {
    const selectedEngineer = this.getSelectedEngineer();

    this.cardsService.addCard(new Card({
      engineerName: `${selectedEngineer?.firstName} ${selectedEngineer?.lastName}`,
      roadNumbers: this.formGroup.controls.roadNumbers.value,
      route: this.formGroup.controls.route.value,
      image: this.getImage(),
      imageOption: this.formGroup.controls.image.value ?? ''
    }));

    this.dialog.closeAll();
  }

  private getImage(): Uint8Array<ArrayBufferLike> | null {
    switch (this.formGroup.controls.image.value) {
      case 'image1':
        return this.getSelectedEngineer()?.image1 ?? null;
      case 'image2':
        return this.getSelectedEngineer()?.image2 ?? null;
      case 'image3':
        return this.getSelectedEngineer()?.image3 ?? null;
      default:
        return null;
    }
  }

  private getSelectedEngineer(): EngineerSchema | null {
    return this.engineers.find(
      e => e.id === (this.formGroup.controls.engineerName.value as {name: string; id: number}).id) ?? null;
  }

  private _filter(value: string | {name: string, id: number}): {name: string; id: number}[] {
    const filterValue = (value as {name: string, id: number})?.name?.toLowerCase() ?? (value as string).toLowerCase();

    return this.engineerNameOptions.filter(option => option.name.toLowerCase().includes(filterValue));
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

class AddCardForm {
  route: FormControl<string>;
  road: FormControl<string>;
  engineerName: FormControl<{name: string; id: number} | string>;
  roadNumbers: FormControl<any>;
  image: FormControl<string | null>;
}
