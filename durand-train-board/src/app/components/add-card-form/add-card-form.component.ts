import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { EngineNumberValidatorService } from '../../services/engine-number-validator.service';


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
    @Inject(MAT_DIALOG_DATA) public data: {card: Card},
    private fb: FormBuilder,
    private dialog: MatDialog,
    private engineerService: EngineerService,
    private cardsService: RailroadCardsService,
    private engineNumberValidatorService: EngineNumberValidatorService
  ) {}

  ngOnInit(): void {
    const card = this.data?.card;

    this.engineerService.get().subscribe(engineers => {
      this.engineers = engineers;
      this.engineerNameOptions = engineers.map(e => ({name: `${e.lastName}, ${e.firstName}`, id: e.id}));

      const engineerName = this.engineerNameOptions.find(e => e.id === card?.engineerId) ?? '';

      this.formGroup = this.fb.group({
        route: this.fb.control(card?.route ?? '', {nonNullable:true, validators: Validators.required}),
        engineerName: this.fb.control<{name: string; id: number} | string>(engineerName, {nonNullable: true, validators: Validators.required}),
        roadNumbers: this.fb.control(card?.roadNumbers ?? [], { validators: this.engineNumberValidator }),
        image: this.fb.control<string | null>(card?.imageOption)
      });

      if (engineerName) {
        this.setImage1Url(this.getSelectedEngineer()?.image1 as Uint8Array<ArrayBufferLike>);
        this.setImage2Url(this.getSelectedEngineer()?.image2 as Uint8Array<ArrayBufferLike>);
        this.setImage3Url(this.getSelectedEngineer()?.image3 as Uint8Array<ArrayBufferLike>);

        card.roadNumbers.forEach(rn => this.addRoadNumber(rn));
      }

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
      });
    });
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

  addRoadNumber(event: MatChipInputEvent | string): void {
    if (typeof event === 'string') {
      this.roadNumbers.update(keywords => [...keywords, event]);
      return;
    }

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

  isEditEngineerDisabled(): boolean {
    return !(this.formGroup.controls.engineerName.value as {name: string; id: number})?.id;
  }

  isSaveDisabled(): boolean {
    return !this.formGroup.valid || this.isEditEngineerDisabled();
  }

  addCard(): void {
    const selectedEngineer = this.getSelectedEngineer();
    const engineerName = 

    this.cardsService.addCard(new Card({
      engineerName: this.getSelectedEngineerName(),
      engineerId: selectedEngineer?.id,
      roadNumbers: this.formGroup.controls.roadNumbers.value,
      route: this.formGroup.controls.route.value,
      image: this.getImage(),
      imageOption: this.formGroup.controls.image.value ?? ''
    }));

    this.engineNumberValidatorService.update(this.getSelectedEngineerName(), this.formGroup.controls.roadNumbers.value)

    this.dialog.closeAll();
  }

  saveCard(): void {
    const selectedEngineer = this.getSelectedEngineer();

    this.cardsService.updateCard(new Card({
      engineerId: selectedEngineer?.id,
      engineerName: this.getSelectedEngineerName(),
      id: this.data?.card?.id,
      image: this.getImage(),
      imageOption: this.formGroup.controls.image.value ?? '',
      roadNumbers: this.roadNumbers(),
      route: this.formGroup.controls.route.value
    }));

    this.engineNumberValidatorService.update(this.getSelectedEngineerName(), this.formGroup.controls.roadNumbers.value);

    this.dialog.closeAll();
  }

  engineNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const roadNumbers = this.formGroup.controls.roadNumbers.value as string[];
    
    const isValid = this.engineNumberValidatorService.isEngineNumbersValid(this.getSelectedEngineerName(), roadNumbers);

    return isValid === true ? null : { error : isValid };
  };

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

  private getSelectedEngineerName(): string {
    const selectedEngineer = this.getSelectedEngineer();
    return `${selectedEngineer?.firstName} ${selectedEngineer?.lastName}`
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
  engineerName: FormControl<{name: string; id: number} | string>;
  roadNumbers: FormControl<any>;
  image: FormControl<string | null>;
}
