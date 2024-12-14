import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { robotsTxtGuardGuard } from './robots-txt-guard.guard';

describe('robotsTxtGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => robotsTxtGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
