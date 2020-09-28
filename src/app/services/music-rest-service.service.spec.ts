import { TestBed } from '@angular/core/testing';

import { MusicRestServiceService } from './music-rest-service.service';

describe('MusicRestServiceService', () => {
  let service: MusicRestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicRestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
