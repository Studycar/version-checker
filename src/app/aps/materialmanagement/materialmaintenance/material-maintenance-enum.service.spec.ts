import { TestBed } from '@angular/core/testing';

import { MaterialMaintenanceEnumService } from './material-maintenance-enum.service';

describe('MaterialMaintenanceEnumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialMaintenanceEnumService = TestBed.get(MaterialMaintenanceEnumService);
    expect(service).toBeTruthy();
  });
});
