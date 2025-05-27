import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { EngineerSchema } from '../schemas/engineer.schema';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {
  constructor(private electron: ElectronService) { }

  add(engineer: EngineerSchema): Observable<EngineerSchema[]> {
    return of(this.electron.ipcRenderer.sendSync('add-engineer', engineer))
      .pipe(catchError(e => throwError(() => new Error(e.json))));
  }

  get(): Observable<EngineerSchema[]> {
    return of(this.electron.ipcRenderer.sendSync('get-engineers'))
      .pipe(catchError(e => throwError(() => new Error(e.json))));
  }

  // delete(rollingStock: RollingStockSchema): Observable<RollingStockSchema[]> {
  //   return of(this.electron.ipcRenderer.sendSync('delete-rolling-stock', rollingStock))
  //     .pipe(catchError(e => throwError(() => new Error(e.json))));
  // }
}
