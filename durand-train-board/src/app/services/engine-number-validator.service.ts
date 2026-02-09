import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineNumberValidatorService {

  // key is engine number, value is engineer
  private _takenNumbers: { [key:string]: string }= {};

  constructor() { }

  update(engineer: string, engineNumbers: string[]): void {
    this.removeEngineerEngineNumbers(engineer);

    engineNumbers.forEach(n => this._takenNumbers[n] = engineer);
  }

  removeEngineerEngineNumbers(engineer: string): void {
    const numbersToDelete = Object.keys(this._takenNumbers).filter(n => this._takenNumbers[n] === engineer);

    numbersToDelete.forEach(n => delete this._takenNumbers[n]);
  }

  isEngineNumbersValid(engineer: string, engineNumbers: string[]): boolean | string[] {
    const invalidTakenNumbers = Object.keys(this._takenNumbers).filter(n => this._takenNumbers[n] !== engineer);

    const invalidNumbers = engineNumbers.filter(e => invalidTakenNumbers.includes(e));

    if (invalidNumbers.length === 0) return true;

    return invalidNumbers.map(n => `${n} taken by ${this._takenNumbers[n]}`);
  }
}
