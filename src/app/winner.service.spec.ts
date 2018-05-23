import { TestBed, inject } from '@angular/core/testing';

import { WinnerService } from './winner.service';

describe('WinnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WinnerService]
    });
  });

  it('should be created', inject([WinnerService], (service: WinnerService) => {
    expect(service).toBeTruthy();
  }));
});
