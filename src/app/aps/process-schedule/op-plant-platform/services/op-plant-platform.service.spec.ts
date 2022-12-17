import { TestBed } from '@angular/core/testing';

import { OPPlantPlatformService } from './op-plant-platform.service';

describe('OPPlantPlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OPPlantPlatformService = TestBed.get(OPPlantPlatformService);
    expect(service).toBeTruthy();
  });
});
