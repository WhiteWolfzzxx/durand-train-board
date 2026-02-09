import { TestBed } from '@angular/core/testing';

import { EngineNumberValidatorService } from './engine-number-validator.service';

describe('EngineNumberValidatorService', () => {
  let service: EngineNumberValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineNumberValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
