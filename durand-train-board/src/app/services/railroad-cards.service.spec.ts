import { TestBed } from '@angular/core/testing';

import { RailroadCardsService } from './railroad-cards.service';

describe('RailroadCardsService', () => {
  let service: RailroadCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RailroadCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
