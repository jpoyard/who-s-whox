import { TestBed, inject } from '@angular/core/testing';

import { WinnerDetailResolverService } from './winner-detail-resolver.service';

describe('WinnerDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WinnerDetailResolverService]
    });
  });

  it('should be created', inject([WinnerDetailResolverService], (service: WinnerDetailResolverService) => {
    expect(service).toBeTruthy();
  }));
});
